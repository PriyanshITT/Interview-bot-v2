import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";

const flaskBaseUrl = process.env.REACT_APP_PRACTICE_URL;

const StartGeneralInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { skills = "", knowledgeDomain = "", interviewType = "General", experience = "" } = location.state || {};
  const [isListening, setIsListening] = useState(false);
  const [stage, setStage] = useState("chooseAvatar");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const avatars = [
    { id: 1, name: "Anandi", img: "https://i.postimg.cc/T16ypJY2/Anandi.jpg", description: "Beginner level" },
    { id: 2, name: "Ada", img: "https://i.postimg.cc/7hfgx65q/Ada.jpg", description: "Moderate level" },
    { id: 3, name: "Chandragupt", img: "https://i.postimg.cc/s2G1mNMD/Chandragupt.jpg", description: "Intermediate level" },
    { id: 4, name: "Alexander", img: "https://i.postimg.cc/QxNtwtFz/Hyp.jpg", description: "Advanced level" },
    { id: 5, name: "Tesla", img: "https://i.postimg.cc/qqy8F7gq/Alex.jpg", description: "Expert level" },
  ];

  useEffect(() => {
    // Removed empty useEffect for brevity, assuming it was incomplete
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setUserInput((prev) => prev + (prev ? " " : "") + speechToText);
    };
    recognition.onerror = () => {
      alert("Speech recognition error. Please try again.");
      setIsListening(false);
    };
    recognition.start();
  };

  const handleStartChat = () => {
    if (selectedAvatarIndex !== null && selectedQuestionCount !== null) {
      setCurrentQuestion(1);
      setStage("chat");
    }
  };

  useEffect(() => {
    if (stage === "chat") {
      const formData = new FormData();
      formData.append("skills", skills);
      formData.append("experience", experience);
      formData.append("interview_type", interviewType);
      formData.append("domain", knowledgeDomain);
      const chosenAvatar = avatars[selectedAvatarIndex];
      formData.append("level", chosenAvatar ? chosenAvatar.description : "");

      fetch(`${flaskBaseUrl}/start_interview`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            setMessages((prev) => [...prev, { sender: "bot", text: result.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          } else {
            setSessionId(result.session_id);
            setMessages([{ sender: "bot", text: result.question, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          }
        })
        .catch((error) => {
          setMessages((prev) => [...prev, { sender: "bot", text: "Failed to start the interview. Please try again later.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        });
    }
  }, [stage, skills, experience, interviewType, knowledgeDomain, selectedAvatarIndex]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isReportLoading) return;
    const userMessage = { sender: "user", text: userInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMessage]);

    if (currentQuestion === selectedQuestionCount) {
      try {
        const response = await fetch(`${flaskBaseUrl}/next_question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, user_answer: userInput, final: true }),
        });
        const data = await response.json();
        if (data.error) {
          setMessages((prev) => [...prev, { sender: "bot", text: data.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        } else {
          setMessages((prev) => [...prev, { sender: "bot", text: "Thank you for your answers. Generating your report...", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          setUserInput("");
          setIsReportLoading(true);
          setTimeout(async () => {
            try {
              const reportResponse = await fetch(`${flaskBaseUrl}/finish_interview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId }),
              });
              const report = await reportResponse.json();
              setReportData(report);
              setPopupType("report");
            } catch (error) {
              console.error("Error generating report:", error);
            }
            setIsReportLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Error sending final answer:", error);
      }
      return;
    }

    try {
      const response = await fetch(`${flaskBaseUrl}/next_question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_answer: userInput, final: false }),
      });
      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: data.question, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        setCurrentQuestion((prev) => prev + 1);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (isCodeMode && e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const indentation = "    ";
      const newValue = userInput.substring(0, selectionStart) + indentation + userInput.substring(selectionEnd);
      setUserInput(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + indentation.length;
      });
    }
  };

  const handleToggleCodeMode = () => setIsCodeMode((prev) => !prev);
  const handleEndTest = () => navigate("/interview-practice");

  const renderAvatarAndQuestionSelection = () => (
    <div className="w-full flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
        Please choose your avatar and level of complexity
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-8 w-full max-w-6xl px-4">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`cursor-pointer flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              selectedAvatarIndex === index 
                ? "border-2 border-indigo-500 shadow-md" 
                : "hover:shadow-xl"
            }`}
            onClick={() => setSelectedAvatarIndex(index)}
          >
            <div className="rounded-full w-20 h-20 overflow-hidden mb-3">
              <img 
                src={avatar.img} 
                alt={avatar.name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">{avatar.name}</h3>
            <p className="text-sm text-gray-600 text-center mt-1">{avatar.description}</p>
          </div>
        ))}
      </div>
      <div className="mb-8 w-full max-w-md px-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
          Please select the number of questions
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[5, 10, 15].map((count) => (
            <button
              key={count}
              onClick={() => setSelectedQuestionCount(count)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 w-24 ${
                selectedQuestionCount === count 
                  ? "bg-indigo-600 text-white shadow-md scale-105" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleStartChat}
        disabled={selectedAvatarIndex === null || selectedQuestionCount === null}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
          selectedAvatarIndex === null || selectedQuestionCount === null 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
        }`}
      >
        Start Interview
      </button>
    </div>
  );

  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;
    return (
      <div className="w-full relative flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
        {popupType && (
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {popupType === "confirm" ? (
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border-l-4 border-purple-300">
                <p className="text-gray-800 font-medium text-lg mb-6">
                  You still have {selectedQuestionCount - currentQuestion + 1} questions remaining. If you proceed now you will not get a report. Do you want to proceed?
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={handleEndTest} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setPopupType(null)} 
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : popupType === "report" && reportData ? (
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Interview Report</h2>
                <div className="mb-6">
                  {reportData.marks_detail.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg mb-4 bg-white shadow-md">
                      <p className="font-semibold text-gray-800">Question {index + 1}:</p>
                      <p className="text-gray-600 mb-2">{item.question}</p>
                      <p className="font-semibold text-gray-800">Your Answer:</p>
                      <p className="text-gray-600 mb-2">{item.answer}</p>
                      <p className="font-semibold text-gray-800">Correct Answer:</p>
                      <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap mb-2">{item.correct_answer}</pre>
                      <p className="font-semibold text-gray-800">Score: <span className="text-indigo-600">{item.score}</span> / {item.max_score}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">Total Score: {reportData.total_score} / {reportData.max_score}</p>
                  <p className="text-gray-600 mb-2">Result: {reportData.result}</p>
                  <p className="text-gray-600 mb-4">Recommendations: {reportData.recommendations}</p>
                  <button 
                    onClick={handleEndTest} 
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
        <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-4 md:gap-6 max-w-7xl mx-auto w-full">
          <div className="md:w-1/4 flex flex-col items-center justify-center p-4 bg-white/80 rounded-xl shadow-lg">
            <div className="rounded-full w-32 h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
              {chosenAvatar && <img src={chosenAvatar.img} alt={chosenAvatar.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />}
            </div>
            {chosenAvatar && (
              <>
                <p className="text-xl font-semibold mb-1 text-gray-800 text-center">{chosenAvatar.name}</p>
                <p className="text-sm text-gray-500 mb-4 text-center">{chosenAvatar.description}</p>
              </>
            )}
            <div className="mt-4 w-full">
              <p className="text-gray-800 font-semibold mb-3 text-center">Question {currentQuestion} of {selectedQuestionCount}</p>
              <button 
                onClick={() => setPopupType("confirm")} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 w-full"
              >
                End Test
              </button>
            </div>
          </div>
          <div className="md:w-3/4 flex flex-col p-4 bg-white/80 rounded-xl shadow-lg">
            <div className="flex-1 min-h-[60vh] max-h-[90vh] overflow-y-auto no-scrollbar border p-3 rounded-lg mb-4 bg-white shadow-md">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-3 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-md text-sm ${
                      msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"
                    } whitespace-pre-wrap`}
                  >
                    {msg.sender === "bot" ? <BotMessage text={msg.text} /> : msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex flex-row items-center gap-2">
              <textarea
                rows={isCodeMode ? 10 : 1}
                className={`flex-1 border mt-4 rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto no-scrollbar ${isCodeMode ? "max-h-64" : "max-h-24"} w-full disabled:bg-gray-100`}
                placeholder="Type here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isReportLoading}
              />
              <button
                className={`p-2 rounded-full transition-transform transform ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={handleStartSpeechRecognition}
                title={isListening ? "Listening..." : "Click to Speak"}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-2 rounded-full text-white font-semibold transition-all duration-200 ${
                    isReportLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  disabled={isReportLoading}
                >
                  {isReportLoading ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center">
      {stage === "chooseAvatar" ? renderAvatarAndQuestionSelection() : renderChatInterface()}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default StartGeneralInterview;