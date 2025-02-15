from flask import Flask, request, jsonify
from flask_cors import CORS
from mail import send_email  
from chat_groq import chat_with_groq 
from interview import start_interview_handler, next_question_handler


app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://157.173.222.234:3000",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://interviewbot.intraintech.com:5173",
	    "http://127.0.0.1:5000",
	    "https://interviewbot.intraintech.com"
        ]
    }
})


@app.route("/send-email", methods=["POST"])
def send_email_route():
    try:
        data = request.json
        user_email = data.get("email", "")
        contact_number = data.get("contact", "")
        user_message = data.get("message", "")

        # Call function from mail.py
        success, response_msg = send_email(user_email, contact_number, user_message)

        if success:
            return jsonify({"message": response_msg})
        else:
            return jsonify({"error": response_msg}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    company = data.get("company", "Apple")
    user_input = data.get("user_input", "")

    response = chat_with_groq(company, user_input)

    return jsonify({"response": response}) 

@app.route('/start_interview', methods=['POST'])
def start_interview():
    skills = request.form.get('skills')
    experience = request.form.get('experience')
    interview_type = request.form.get('interview_type')
    domain = request.form.get('domain')
    session_id = request.form.get('session_id')  # Optional: auto-generate if not provided

    if not skills or not experience or not interview_type or not domain:
        return jsonify({"error": "Skills, experience, interview type, and domain are required."}), 400

    try:
        first_question, session_id = start_interview_handler(
            skills, experience, interview_type, domain, session_id
        )
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

    try:
        next_question_text = next_question_handler(session_id, user_answer)
        return jsonify({"question": next_question_text, "session_id": session_id})
    except Exception as e:

        return jsonify({"error": f"Error generating next question: {str(e)}"}), 500









if __name__ == "__main__":	
    app.run(host='0.0.0.0', port=5050)
