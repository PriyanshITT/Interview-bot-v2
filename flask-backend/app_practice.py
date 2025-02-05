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
            "http://localhost:3000",    # Added for development
            "http://localhost:5173",
            "http://interviewbot.intraintech.com:5173"
        ]
    }
})



# Global session storage
sessions = {}

# System prompt template
question_system_prompt = """
You are an AI interview bot conducting a professional job interview. Your role is to ask thoughtful and engaging questions based on the candidate's skills, experience, interview type, and domain provided.

1. Focus on the Skills and technical knowledge, Role responsibilities in the specified domain, Relevant work experience
2. Ask one question at a time and wait for the candidate's response.  
3. Avoid repeating questions.  
4. Tailor each question to the candidate's profile.  

Inputs: Skills: {skills}, Experience: {experience}, Interview Type: {interview_type}, Domain: {domain}.  

Ask the next question.
"""

# Chat prompt
question_prompt = ChatPromptTemplate.from_messages([
    ("system", question_system_prompt),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
])

# Initialize LLM
llm = ChatGroq(groq_api_key='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', model_name="gemma2-9b-it")

# Create conversational chain
question_chain = RunnableSequence(question_prompt | llm)

@app.route('/start_interview', methods=['POST'])
def start_interview():
    skills = request.form.get('skills')
    experience = request.form.get('experience')
    interview_type = request.form.get('interview_type')
    domain = request.form.get('domain')
    session_id = request.form.get('session_id', str(uuid.uuid4()))

    if not skills or not experience or not interview_type or not domain:
        return jsonify({"error": "Skills, experience, interview type, and domain are required."}), 400

    conversational_chain = RunnableWithMessageHistory(
        question_chain,
        lambda _: ChatMessageHistory(),
        input_messages_key="input",
        history_messages_key="chat_history"
    )

    sessions[session_id] = conversational_chain

    try:
        response = conversational_chain.invoke(
            {
                "input": "Start the interview.",
                "chat_history": [],
                "skills": skills,
                "experience": experience,
                "interview_type": interview_type,
                "domain": domain
            },
            {"configurable": {"session_id": session_id}}
        )

        print("LLM Response:", response)  # Debugging output

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

    conversational_chain = sessions.get(session_id)
    if not conversational_chain:
        return jsonify({"error": "Invalid session ID."}), 400

    try:
        response = conversational_chain.invoke(
            {
                "input": user_answer,
                "chat_history": [],
            },
            {"configurable": {"session_id": session_id}}
        )

        print("LLM Response:", response)  # Debugging output

        next_question = response.content if hasattr(response, 'content') else 'No next question generated.'
        return jsonify({"question": next_question, "session_id": session_id})

    except Exception as e:
        return jsonify({"error": f"Error generating next question: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5041)