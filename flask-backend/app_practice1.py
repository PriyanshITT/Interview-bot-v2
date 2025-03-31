from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import uuid
import os
from openpyxl import Workbook, load_workbook
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables import RunnableSequence

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://157.173.222.234:3000",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://interviewbot.intraintech.com:5173",
            "http://127.0.0.1:3000"
        ]
    }
}, supports_credentials=True)

# Global session storage
sessions = {}

# Initialize ChatGroq LLM instance (use your API key and model name)
llm = ChatGroq(groq_api_key='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', model_name="gemma2-9b-it")

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
    - Do not ask any coding related questions.
    - Do not provide any introduction or explanation.
    - Ensure questions align with real-world applications in **{domain}**.
    """

    question_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])

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
        },
        "responses": []  # store dicts with question and answer
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
        sessions[session_id]["details"]["last_question"] = first_question
        return jsonify({"question": first_question, "session_id": session_id})
    except Exception as e:
        return jsonify({"error": f"Error generating question: {str(e)}"}), 500

@app.route('/next_question', methods=['POST'])
def next_question():
    data = request.get_json()
    session_id = data.get('session_id')
    user_answer = data.get('user_answer')
    final_flag = data.get('final', False)

    if not session_id or not user_answer:
        return jsonify({"error": "Session ID and user answer are required."}), 400

    session_data = sessions.get(session_id)
    if not session_data:
        return jsonify({"error": "Invalid session ID."}), 400

    conversational_chain = session_data["chain"]
    details = session_data["details"]

    # Save the user's response with the last asked question.
    session_data["responses"].append({
        "question": details.get("last_question", "Unknown question"),
        "answer": user_answer
    })

    if final_flag:
        # If final_flag is true, simply return a confirmation message.
        return jsonify({"message": "Final answer recorded.", "session_id": session_id})

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
        sessions[session_id]["details"]["last_question"] = next_question_text
        return jsonify({"question": next_question_text, "session_id": session_id})
    except Exception as e:
        return jsonify({"error": f"Error generating next question: {str(e)}"}), 500

@app.route('/finish_interview', methods=['POST'])
def finish_interview():
    data = request.get_json()
    session_id = data.get('session_id')
    if not session_id:
        return jsonify({"error": "Session ID is required."}), 400

    session_data = sessions.get(session_id)
    if not session_data:
        return jsonify({"error": "Invalid session ID."}), 400

    responses = session_data.get("responses", [])
    if not responses:
        return jsonify({"error": "No responses recorded."}), 400

    marks_detail = []
    total_score = 0
    max_total = 5 * len(responses)  # each question is out of 5

    for item in responses:
        question = item.get("question")
        answer = item.get("answer")

        # Prompt to evaluate the user's answer and provide a score
        grading_prompt = f"""
        You are an AI evaluator. Evaluate the following answer for the given interview question.
        Question: {question}
        Answer: {answer}
        Provide a score out of 5 based on accuracy, depth, and clarity. Respond with only the number.
        """
        try:
            grade_response = llm.invoke(grading_prompt)
            score_str = grade_response.content.strip() if hasattr(grade_response, 'content') else "0"
            try:
                score = float(score_str)
            except ValueError:
                score = 0
        except Exception as e:
            score = 0

        correct_answer_prompt = f"""
        You are an expert in the relevant domain. Provide the correct answer to the following technical interview question. 
        The answer should be concise (1-3 sentences, max 50 words) and clear, focusing on the key points without excessive detail or oversimplification.
        Question: {question}
        Respond with only the answer, no additional explanation.
        """
        try:
            correct_answer_response = llm.invoke(correct_answer_prompt)
            correct_answer = correct_answer_response.content.strip() if hasattr(correct_answer_response, 'content') else "Unable to generate correct answer."
        except Exception as e:
            correct_answer = "Error generating correct answer."

        marks_detail.append({
            "question": question,
            "answer": answer,
            "correct_answer": correct_answer,
            "score": score,
            "max_score": 5
        })
        total_score += score

    passing_threshold = 0.4 * max_total
    result = "Pass" if total_score >= passing_threshold else "Fail"
    recommendations = "Review the areas where your responses scored lower. Practice problem solving and review key technical concepts."

    report = {
        "marks_detail": marks_detail,
        "total_score": total_score,
        "max_score": max_total,
        "result": result,
        "recommendations": recommendations
    }
    return jsonify(report)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5041)
