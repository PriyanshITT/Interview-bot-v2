from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS (Allow frontend requests)
CORS(app, resources={r"/api/analyze": {"origins": os.getenv("FRONTEND_URL", "http://localhost:3000")}})

@app.route("/api/analyze", methods=["POST"])
def analyze_sentiment():
    """Analyze sentiment of the provided text."""
    data = request.json
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    sentiment_score = TextBlob(text).sentiment.polarity
    sentiment = "Positive" if sentiment_score > 0 else "Negative" if sentiment_score < 0 else "Neutral"

    return jsonify({"sentiment": sentiment})

if __name__ == "__main__":
    app.run(debug=True, port=int(os.getenv("FLASK_PORT", 5000)))
