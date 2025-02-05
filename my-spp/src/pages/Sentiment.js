import React, { useState } from "react";

const Sentiment = () => {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    setSentiment(`Sentiment: ${data.sentiment}`);
  };


  return (
    <div className="sentiment-container">
      <h1>Sentiment Analyzer</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text here..." />
      <button onClick={analyzeSentiment}>Analyze</button>
      {sentiment && <p>{sentiment}</p>}
    </div>
  );
};

export default Sentiment;
