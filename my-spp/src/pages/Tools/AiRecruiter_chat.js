import React, { useState } from "react";
import {
  SiApple,
  SiNvidia,
  SiOracle,
  SiAmazon,
  SiGoogle,
  SiTesla,
} from "react-icons/si";
import { FaIbm, FaMicrosoft } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";

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
  const [typing, setTyping] = useState(false);

  const companies = [
    { name: "Apple", icon: <SiApple /> },
    { name: "Microsoft", icon: <FaMicrosoft /> },
    { name: "Google", icon: <SiGoogle /> },
    { name: "NVIDIA", icon: <SiNvidia /> },
    { name: "Oracle", icon: <SiOracle /> },
    { name: "Amazon", icon: <SiAmazon /> },
    { name: "Tesla", icon: <SiTesla /> },
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
      const res = await fetch("https://interviewbot.intraintech.com/recruiter/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: selectedCompany,
          user_input: input,
        }),
      });

      const data = await res.json();
      setTyping(true);
      typeMessage(data.response);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Error connecting to AI.", timestamp: new Date().toLocaleTimeString() },
      ]);
    }
  };

  const typeMessage = (message) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.role === "assistant") {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: message.substring(0, i + 1) },
            ];
          } else {
            return [
              ...prevMessages,
              { role: "assistant", content: message.substring(0, i + 1), timestamp: new Date().toLocaleTimeString() },
            ];
          }
        });
        i++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 30);
  };

  return (
    <div className="flex h-[87vh] bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-4 h-[87vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tech Recruiters</h2>
        {companies.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex items-center w-full text-left p-3 rounded-lg ${
              selectedCompany === name ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 hover:scale-105"
            } mb-2 transition-all duration-300`}
            onClick={() => handleCompanyChange(name)}
          >
            <span className="mr-2">{icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Chat Section */}
      <div className="w-3/4 flex flex-col p-6 h-[87vh]">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-4 overflow-y-auto max-h-[600px]">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start my-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && <FaRobot className="text-gray-600 mr-2 mt-1" />}
              <div className={`p-3 rounded-lg max-w-lg relative ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              } transition-all duration-300`}>
                <pre className="whitespace-pre-wrap">{msg.content}</pre>
                {
                  msg.role==="assistant"  && <span className="text-xs text-gray-500 absolute bottom-1 right-2">{msg.timestamp}</span>
                  
                }
                
              </div>
            </div>
          ))}
          
        </div>

        {/* Input */}
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}