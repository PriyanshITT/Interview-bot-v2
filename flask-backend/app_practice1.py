from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables import RunnableSequence
import uuid

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://interviewbot.intraintech.com:5173"
        ]
    }
})

# Global session storage
sessions = {}

@app.route('/start_interview', methods=['POST'])
def start_interview():
    skills = request.form.get('skills')
    experience = request.form.get('experience')
    interview_type = request.form.get('interview_type')
    domain = request.form.get('domain')
    level = request.form.get('level', '1')
    session_id = request.form.get('session_id', str(uuid.uuid4()))

    if not skills or not experience or not interview_type or not domain or not level:
        return jsonify({"error": "All fields including level are required."}), 400
    
    system_prompt = f"""
    You are an AI interview bot conducting a **{level} level** technical interview for a candidate skilled in **{skills}**, with **{experience}** experience in the **{domain}** domain. 
    
    Your role is to ask **only one technical question** strictly related to the candidate's expertise.  
    - Do not ask any coding related questions
    - Do not provide any introduction, explanation, or difficulty level.  
    - Ensure questions align with real-world applications and problem-solving within **{domain}**.  
    - Questions should be appropriate for a candidate with **{experience}** experience in **{skills}**.  
    """
    
    question_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])
    
    llm = ChatGroq(groq_api_key='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', model_name="llama-3.3-70b-versatile")
    question_chain = RunnableSequence(question_prompt | llm)
    
    conversational_chain = RunnableWithMessageHistory(
        question_chain,
        lambda _: ChatMessageHistory(),
        input_messages_key="input",
        history_messages_key="chat_history"
    )

    sessions[session_id] = {
        "chain": conversational_chain,
        "details": {
            "skills": skills,
            "experience": experience,
            "interview_type": interview_type,
            "domain": domain,
            "level": level
        }
    }

    try:
        response = conversational_chain.invoke(
            {
                "input": "Start the interview.",
                "chat_history": [],
                "skills": skills,
                "experience": experience,
                "interview_type": interview_type,
                "domain": domain,
                "level": level
            },
            {"configurable": {"session_id": session_id}}
        )
        
        first_question = response.content if hasattr(response, 'content') else 'No question generated.'
        return jsonify({"question": first_question, "session_id": session_id})
    
    except Exception as e:
        return jsonify({"error": f"Error generating question: {str(e)}"}), 500

@app.route('/next_question', methods=['POST'])
def next_question():
    data = request.get_json()
    session_id = data.get('session_id')
    user_answer = data.get('user_answer')

    if not session_id or not user_answer:
        return jsonify({"error": "Session ID and user answer are required."}), 400

    session_data = sessions.get(session_id)
    if not session_data:
        return jsonify({"error": "Invalid session ID."}), 400

    conversational_chain = session_data["chain"]
    details = session_data["details"]

    try:
        response = conversational_chain.invoke(
            {
                "input": user_answer,
                "skills": details["skills"],
                "experience": details["experience"],
                "interview_type": details["interview_type"],
                "domain": details["domain"],
                "level": details["level"]
            },
            {"configurable": {"session_id": session_id}}
        )

        next_question_text = response.content if hasattr(response, 'content') else 'No next question generated.'
        return jsonify({"question": next_question_text, "session_id": session_id})
    
    except Exception as e:
        return jsonify({"error": f"Error generating next question: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5041)
