from flask import Flask, request, jsonify
from flask_cors import CORS
from mail import send_email  

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
