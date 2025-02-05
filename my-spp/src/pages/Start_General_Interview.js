import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const StartGeneralInterview = () => {
  // Grab the form data passed from PracticeTest
  const location = useLocation();
  const {
    role = "",
    skills = "",
    knowledgeDomain = "",
    interviewType = "General",
  } = location.state || {};

  // Page stage: "chooseAvatar" or "chat"
  const [stage, setStage] = useState("chooseAvatar");

  // Which avatar is selected
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);

  // Toggle for code mode (expanded textarea)
  const [isCodeMode, setIsCodeMode] = useState(false);

  // Sample Avatars
  const avatars = [
    {
      id: 1,
      name: "Sophia",
      img: "https://randomuser.me/api/portraits/women/45.jpg",
      description: "A friendly AI mentor specializing in Data & ML topics.",
    },
    {
      id: 2,
      name: "James",
      img: "https://randomuser.me/api/portraits/men/46.jpg",
      description: "Your go-to for coding, architecture, and big data insights.",
    },
    {
      id: 3,
      name: "Ava",
      img: "https://randomuser.me/api/portraits/women/35.jpg",
      description: "Expert in cloud engineering and AI pipelines.",
    },
    {
      id: 4,
      name: "Ethan",
      img: "https://randomuser.me/api/portraits/men/36.jpg",
      description:
        "Loves DevOps practices and advanced system design strategies.",
    },
    {
      id: 5,
      name: "Mia",
      img: "https://randomuser.me/api/portraits/women/47.jpg",
      description: "Specializes in data visualization and analytics storytelling.",
    },
  ];

  // Chat messages: now starts with the bot only
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hey there! I see you're aiming for a "${role}" role, with "${skills}" skills, focusing on "${knowledgeDomain}". This is a "${interviewType}" interview. Are you ready to begin?`,
      time: "Just now",
    },
  ]);

  // Tracks user’s typed chat input
  const [userInput, setUserInput] = useState("");

  // Ref to auto-scroll to bottom of the chat
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Switch from avatar selection to chat
  const handleStartInterview = () => {
    if (selectedAvatarIndex !== null) {
      setStage("chat");
    }
  };

  // Send a new user message
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const newMsg = {
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");
  };

  // Keydown handler for textarea
  const handleKeyDown = (e) => {
    // Enter (no Shift) => send message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      return;
    }
    // If SHIFT+ENTER => new line, default behavior

    // In code mode, pressing Tab => insert 4 spaces
    if (isCodeMode && e.key === "Tab") {
      e.preventDefault();

      const { selectionStart, selectionEnd } = e.target;
      const indentation = "    "; // 4 spaces
      const newValue =
        userInput.substring(0, selectionStart) +
        indentation +
        userInput.substring(selectionEnd);

      setUserInput(newValue);

      // Move cursor forward by 4 positions
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd =
          selectionStart + indentation.length;
      });
    }
  };

  // Toggle code mode
  const handleToggleCodeMode = () => {
    setIsCodeMode((prev) => !prev);
  };

  // Placeholder for mic button
  const handleMicClick = () => {
    alert("Mic button clicked (placeholder). Integrate speech recognition here!");
  };

  // Avatar selection screen
  const renderAvatarSelection = () => (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Please choose your avatar
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-8">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`cursor-pointer flex flex-col items-center 
              bg-white p-4 rounded-xl shadow-lg border
              transform transition-transform hover:scale-105
              ${
                selectedAvatarIndex === index ? "ring-4 ring-indigo-500" : ""
              }`}
            onClick={() => setSelectedAvatarIndex(index)}
          >
            <div className="rounded-full w-20 h-20 overflow-hidden mb-3">
              <img
                src={avatar.img}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {avatar.name}
            </h3>
            <p className="text-sm text-gray-600 text-center mt-1">
              {avatar.description}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={handleStartInterview}
        disabled={selectedAvatarIndex === null}
        className={`px-6 py-3 rounded-lg text-white font-semibold 
          ${
            selectedAvatarIndex === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
      >
        Get started with Interview
      </button>
    </div>
  );

  // Chat interface
  const renderChatInterface = () => {
    const chosenAvatar =
      selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;

    return (
      <div className="w-full flex flex-col md:flex-row min-h-[700px]">
        {/* Left panel */}
        <div className="md:w-1/3 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="rounded-full w-32 h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
            {chosenAvatar && (
              <img
                src={chosenAvatar.img}
                alt={chosenAvatar.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {chosenAvatar && (
            <>
              <p className="text-xl font-semibold mb-1 text-gray-800">
                {chosenAvatar.name}
              </p>
              <p className="text-sm text-gray-500 mb-4 text-center">
                {chosenAvatar.description}
              </p>
            </>
          )}
          {/* Fake voice wave */}
          <div className="w-48 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            <p className="text-xs text-gray-400">Voice Wave</p>
          </div>
        </div>

        {/* Right panel (Chat) */}
        <div className="md:w-2/3 flex flex-col p-6">
          {/* Chat header */}
          <div className="flex items-center mb-4">
            {chosenAvatar && (
              <div className="w-10 h-10 mr-2">
                <img
                  src={chosenAvatar.img}
                  alt="Bot Avatar"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {chosenAvatar ? `${chosenAvatar.name} Bot` : "Interview Bot"}
            </h2>
          </div>

          {/* Messages list (fixed height, auto-scroll) */}
          <div className="h-[600px] overflow-y-auto border p-3 rounded-lg mb-4 bg-white shadow-md">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } whitespace-pre-wrap`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
              </div>
            ))}
            {/* Dummy div to scroll into view */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input row */}
          <div className="flex items-center space-x-2">
            {/* Mic Button */}
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 focus:outline-none"
              onClick={handleMicClick}
            >
              {/* A slightly more complete mic icon from Heroicons */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3"
                />
              </svg>
            </button>

            {/* The textarea (for multi-line input) */}
            <textarea
              rows={isCodeMode ? 10 : 1}
              className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none shadow-sm 
                resize-none overflow-y-auto 
                ${isCodeMode ? "max-h-64" : "max-h-24"}`}
              placeholder="Type your message. (Enter=Send, Shift+Enter=New line)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Code mode button */}
            <button
              className={`p-2 rounded-full text-gray-700 focus:outline-none 
                ${
                  isCodeMode
                    ? "bg-indigo-200 hover:bg-indigo-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              title="Toggle code mode (expand the text area)"
              onClick={handleToggleCodeMode}
            >
              {/* Simple code icon (Heroicons style) */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 18l6-6-6-6M8 6l-6 6 6 6"
                />
              </svg>
            </button>

            {/* Send Button */}
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    // Full screen, no page scrolling, only chat area scrolls
    <div className="relative w-full h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Glass container */}
      <div className="relative z-10 w-full max-w-5xl p-4 md:p-8 bg-white/30 
                      backdrop-blur-xl backdrop-saturate-150 rounded-3xl 
                      shadow-2xl border border-white/20">
        {stage === "chooseAvatar" ? renderAvatarSelection() : renderChatInterface()}
      </div>
    </div>
  );
};

export default StartGeneralInterview;
