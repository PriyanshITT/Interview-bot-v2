import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const JobRoleBasedInterview = () => {
  const location = useLocation();
  const { role, skills, knowledgeDomain, fileName, interviewType } = location.state || {};

  const [stage, setStage] = useState("chooseAvatar"); // "chooseAvatar" or "chat"
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello! You are applying for a "${role}" role with skills in "${skills}", specializing in "${knowledgeDomain}". Your resume "${fileName}" is uploaded. Are you ready for the interview?`,
      time: "Just now",
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Avatars list
  const avatars = [
    { id: 1, name: "Sophia", img: "https://randomuser.me/api/portraits/women/45.jpg" },
    { id: 2, name: "James", img: "https://randomuser.me/api/portraits/men/46.jpg" },
    { id: 3, name: "Ava", img: "https://randomuser.me/api/portraits/women/35.jpg" },
    { id: 4, name: "Ethan", img: "https://randomuser.me/api/portraits/men/36.jpg" },
    { id: 5, name: "Mia", img: "https://randomuser.me/api/portraits/women/47.jpg" },
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    setMessages([...messages, { sender: "user", text: userInput, time: new Date().toLocaleTimeString() }]);
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderAvatarSelection = () => (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Choose Your Interview Avatar</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
        {avatars.map((avatar, index) => (
          <div key={avatar.id} className={`cursor-pointer flex flex-col items-center p-4 bg-white rounded-xl shadow-md transition-all ${selectedAvatarIndex === index ? "ring-4 ring-indigo-500" : ""}`} onClick={() => setSelectedAvatarIndex(index)}>
            <img src={avatar.img} alt={avatar.name} className="rounded-full w-20 h-20 mb-2 object-cover" />
            <p className="text-lg font-semibold">{avatar.name}</p>
          </div>
        ))}
      </div>
      <button onClick={() => selectedAvatarIndex !== null && setStage("chat")} className={`px-6 py-3 rounded-lg text-white font-semibold ${selectedAvatarIndex === null ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>Start Interview</button>
    </div>
  );

  const renderChatInterface = () => {
    const chosenAvatar = avatars[selectedAvatarIndex];

    return (
      <div className="w-full flex flex-col md:flex-row h-screen">
        <div className="md:w-1/3 flex flex-col items-center justify-center p-8 border-r border-gray-200">
          <img src={chosenAvatar.img} alt={chosenAvatar.name} className="rounded-full w-32 h-32 mb-4" />
          <p className="text-xl font-semibold">{chosenAvatar.name}</p>
        </div>

        <div className="md:w-2/3 flex flex-col p-6">
          <div className="h-[600px] overflow-y-auto border p-3 rounded-lg mb-4 bg-white shadow-md">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center space-x-2">
            <textarea rows={1} className="flex-1 border rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none" placeholder="Type your message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyDown} />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl p-8 bg-white/30 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20">
        {stage === "chooseAvatar" ? renderAvatarSelection() : renderChatInterface()}
      </div>
    </div>
  );
};

export default JobRoleBasedInterview;
