import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BotMessage from "../../components/BotMessage";

const JobRoleBasedInterview = () => {
  // Grab the form data passed from InterviewTest
  const location = useLocation();
  const [question,setQuestion] = useState("");
  const {
    interviewType = "",
    role = "",
    fileName = "",
    file=null,
    experience = "",
    companyName = "",
    skills = "",
    knowledgeDomain = ""
  } = location.state || {};




  // Page stage: "chooseAvatar" or "chat"
  const [stage, setStage] = useState("chooseAvatar");

  // Which avatar is selected
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);

  // Toggle for code mode (expanded textarea)
  const [isCodeMode, setIsCodeMode] = useState(false);

  // Session ID from backend for the interview conversation
  const [sessionId, setSessionId] = useState(null);


  // Sample Avatars
  const avatars = [
    {
      id: 1,
      name: "Sophia",
      img: "https://randomuser.me/api/portraits/women/45.jpg",
      description: "Beginner level",
    },
    {
      id: 2,
      name: "James",
      img: "https://randomuser.me/api/portraits/men/46.jpg",
      description: "Moderate level",
    },
    {
      id: 3,
      name: "Ava",
      img: "https://randomuser.me/api/portraits/women/35.jpg",
      description: "Intermediate level",
    },
    {
      id: 4,
      name: "Ethan",
      img: "https://randomuser.me/api/portraits/men/36.jpg",
      description: "Advanced level",
    },
    {
      id: 5,
      name: "Mia",
      img: "https://randomuser.me/api/portraits/women/47.jpg",
      description: "Expert level",
    },
  ];

  // Chat messages: starts with the bot (will be replaced on interview start)
  const [messages, setMessages] = useState([]);
  
  // Tracks user’s typed chat input
  const [userInput, setUserInput] = useState("");

  // Ref to auto-scroll to bottom of the chat
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Switch from avatar selection to chat and initialize the interview session
  const handleStartInterview = () => {
    if (selectedAvatarIndex !== null) {
      setStage("chat");
    }
  };

  // When the chat stage starts, initialize the interview by calling the backend
  useEffect(() => {
    
    if (stage === "chat") {
      // Create a form data object to send the initial details
      const formData = new FormData();
      formData.append("job_role", role);
      formData.append("experience", experience);
      formData.append("company_name", companyName);
      formData.append("skills", skills);
      formData.append("domain", knowledgeDomain);
      formData.append("resume",file);
      formData.append("level",avatars[ selectedAvatarIndex].description)
      
      fetch("http://172.19.179.79:5040/upload_resume", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            console.error("Error:", result.error);
            // Optionally, display error message to user
            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: result.error,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          } else {
            // Save the session ID returned by your backend
            setSessionId(result.session_id);
            setQuestion(result.question);
            console.log(question);
            // Set the initial bot message with the first interview question
            setMessages([
              {
                sender: "bot",
                text: result.question,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          }
        })
        .catch((error) => {
          console.error("Error starting interview:", error);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Failed to start the interview. Please try again later.",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        });
    }
  },[stage]);

  // Send a new user message and call the backend for the next question
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Append the user's message immediately to the chat
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://172.19.179.79:5040/next_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: userInput,
          job_role:role,
          question:question,
          experience:experience,
          user_id:2,
          level:avatars[ selectedAvatarIndex].description,
          company_name:companyName,
          skills:skills,
          domain:knowledgeDomain
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Error from backend:", data.error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.error,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        const botMessage = {
          sender: "bot",
          text: data.question,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

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
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + indentation.length;
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
        Please choose your avatar and level of complexity
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-8">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`cursor-pointer flex flex-col items-center 
              bg-white p-4 rounded-xl shadow-lg border
              transform transition-transform hover:scale-105
              ${selectedAvatarIndex === index ? "ring-4 ring-indigo-500" : ""}`}
            onClick={() => setSelectedAvatarIndex(index)}
          >
            <div className="rounded-full w-20 h-20 overflow-hidden mb-3">
              <img src={avatar.img} alt={avatar.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{avatar.name}</h3>
            <p className="text-sm text-gray-600 text-center mt-1">{avatar.description}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleStartInterview}
        disabled={selectedAvatarIndex === null}
        className={`px-6 py-3 rounded-lg text-white font-semibold 
          ${selectedAvatarIndex === null ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        Get started with Interview
      </button>
    </div>
  );

  // Chat interface with interview details display
  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;

    return (
      <div className="w-full flex flex-col md:flex-row min-h-[700px] ">
        {/* Left panel */}
        <div className="md:w-1/5 flex flex-col items-center justify-start p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="rounded-full w-32 h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
            {chosenAvatar && (
              <img src={chosenAvatar.img} alt={chosenAvatar.name} className="w-full h-full object-cover" />
            )}
          </div>
          {chosenAvatar && (
            <>
              <p className="text-xl font-semibold mb-1 text-gray-800">{chosenAvatar.name}</p>
              <p className="text-sm text-gray-500 mb-4 text-center">{chosenAvatar.description}</p>
            </>
          )}
          {/* Display passed interview details */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Interview Details</h3>
            <p>
              <strong>Interview Type:</strong> {interviewType}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
            {interviewType === "job-role" && (
              <>
                <p>
                  <strong>Experience:</strong> {experience}
                </p>
                <p>
                  <strong>Company Name:</strong> {companyName}
                </p>
                <p>
                  <strong>Skills:</strong> {skills}
                </p>
                <p>
                  <strong>Knowledge Domain:</strong> {knowledgeDomain}
                </p>
              </>
            )}
            <p>
              <strong>Uploaded File:</strong> {fileName}
            </p>
          </div>
          {/* Fake voice wave */}
          <div className="w-48 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm mt-4">
            <p className="text-xs text-gray-400">Voice Wave</p>
          </div>
        </div>

        {/* Right panel (Chat) */}
        <div className="md:w-4/5 flex flex-col p-6">
          {/* Chat header */}
          <div className="flex items-center mb-3">
            {chosenAvatar && (
              <div className="w-10 h-10 mr-2">
                <img src={chosenAvatar.img} alt="Bot Avatar" className="rounded-full object-cover w-full h-full" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {chosenAvatar ? `${chosenAvatar.name} Bot` : "Interview Bot"}
            </h2>
          </div>

          {/* Messages list (fixed height, auto-scroll) */}
          <div className="h-[500px] overflow-y-auto border p-3 rounded-lg mb-4 bg-white shadow-md">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2 rounded-lg max-w-md text-sm ${
                    msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"
                  } whitespace-pre-wrap`}
                >
                  {msg.sender === "bot" ? <BotMessage text={msg.text} delay={150} /> : msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
  
          {/* Chat input row */}
          <div className="flex items-center space-x-2">
            {/* Mic Button */}
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 focus:outline-none"
              onClick={handleMicClick}
            >
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
              className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto ${isCodeMode ? "max-h-64" : "max-h-24"}`}
              placeholder="Type your message. (Enter=Send, Shift+Enter=New line)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Code mode button */}
            <button
              className={`p-2 rounded-full text-gray-700 focus:outline-none ${isCodeMode ? "bg-indigo-200 hover:bg-indigo-300" : "bg-gray-200 hover:bg-gray-300"}`}
              title="Toggle code mode (expand the text area)"
              onClick={handleToggleCodeMode}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
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
      <div className="relative z-10 w-full max-w-5xl p-4 md:p-8 bg-white/30 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20">
        {stage === "chooseAvatar" ? renderAvatarSelection() : renderChatInterface()}
      </div>
    </div>
  );
};

export default JobRoleBasedInterview;
