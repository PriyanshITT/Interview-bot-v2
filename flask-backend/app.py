from flask import Flask, request, jsonify
from flask_cors import CORS
from mail import send_email  
from chat_groq import chat_with_groq 


app = Flask(__name__)
CORS(app)  # Allow all frontend requests

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
