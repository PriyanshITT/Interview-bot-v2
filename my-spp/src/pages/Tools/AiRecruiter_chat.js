import React, { useState } from "react";

export default function AiRecruiterChat() {
  const [selectedCompany, setSelectedCompany] = useState("Apple");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello, I am a recruiter at ${selectedCompany}. I'm here to answer any questions about recruitment, interviews, and company culture.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");

  const companies = [
    "Apple",
    "NVIDIA",
    "Oracle",
    "Amazon",
    "Google",
    "Tesla",
    "IBM",
    "Microsoft",
  ];

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
    setMessages([
      {
        role: "assistant",
        content: `Hello, I am a recruiter at ${company}. I'm here to answer any questions about recruitment, interviews, and company culture.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input, timestamp: new Date().toLocaleTimeString() },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: selectedCompany,
          user_input: input,
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to AI.", timestamp: new Date().toLocaleTimeString() },
      ]);
    }
  };

  return (
    <div className="flex h-[87vh] bg-gray-100">
  {/* Sidebar */}
  <div className="w-1/4 bg-white shadow-lg p-4 h-[87vh]">
    <h2 className="text-xl font-bold mb-4">Tech Recruiters</h2>
    {companies.map((company) => (
      <button
        key={company}
        className={`block w-full text-left p-3 rounded-lg ${
          selectedCompany === company ? "bg-blue-500 text-white" : "bg-gray-200"
        } mb-2 transition`}
        onClick={() => handleCompanyChange(company)}
      >
        {company}
      </button>
    ))}
  </div>

  
  {/* Chat Section */}
  <div className="w-3/4 flex flex-col p-6 h-[87vh]">
    <div className="flex-1 bg-white shadow-lg rounded-lg p-4 overflow-y-auto max-h-[600px]">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 my-2 rounded-lg max-w-lg relative ${
            msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black self-end"
          }`}
        >
          <pre className="whitespace-pre-wrap">{msg.content}</pre>
          <span className="text-xs text-gray-500 absolute bottom-1 right-2">{msg.timestamp}</span>
        </div>
      ))}
    </div>

    {/* Input */}
    <div className="mt-4 flex">
      <input
        type="text"
        className="flex-1 p-3 border rounded-lg"
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="ml-2 p-3 bg-blue-500 text-white rounded-lg" onClick={sendMessage}>
        Send
      </button>
    </div>
  </div>
</div>
  );
}
