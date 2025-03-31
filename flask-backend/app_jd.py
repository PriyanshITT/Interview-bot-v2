from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables import RunnableSequence
import uuid
from openpyxl import Workbook, load_workbook
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://157.173.222.234:3000",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://interviewbot.intraintech.com:5173"
]}})

# Global session storage
sessions = {}

@app.route('/start_interview', methods=['POST'])
def start_interview():
    job_role = request.form.get('job_role')
    job_description = request.form.get('job_description')
    level = request.form.get('level', '1')
    session_id = request.form.get('session_id', str(uuid.uuid4()))

    if not job_role or not job_description:
        return jsonify({"error": "Both job_role and job_description are required."}), 400
    
    system_prompt = f"""
    You are an AI interview bot conducting a technical interview for a candidate applying for the role of **{job_role}**.
    
    The job description provided is: **{job_description}**.
    
    Your role is to ask **only one technical question** strictly related to the job role and description.
    - Do not ask any coding-related questions.
    - Do not provide any introduction, explanation, or difficulty level.
    - Ensure questions align with real-world applications and problem-solving for **{job_role}**.
    """
    
    question_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])
    
    llm = ChatGroq(groq_api_key='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', model_name="gemma2-9b-it")
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
            "job_role": job_role,
            "job_description": job_description,
            "level": level
        }
    }

    try:
        response = conversational_chain.invoke(
            {
                "input": "Start the interview.",
                "chat_history": [],
                "job_role": job_role,
                "job_description": job_description,
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
                "job_role": details["job_role"],
                "job_description": details["job_description"],
                "level": details["level"]
            },
            {"configurable": {"session_id": session_id}}
        )
        
        next_question_text = response.content if hasattr(response, 'content') else 'No next question generated.'
        return jsonify({"question": next_question_text, "session_id": session_id})
    
    except Exception as e:
        return jsonify({"error": f"Error generating next question: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5051)
