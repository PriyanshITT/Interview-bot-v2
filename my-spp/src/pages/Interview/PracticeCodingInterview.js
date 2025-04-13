import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";

const CodingPracticeUrl = process.env.REACT_APP_CODING_URL;

const PracticeCodingInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience = "", skills = "", interviewType = "Coding Interview" } = location.state || {};

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
  const [codeInput, setCodeInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    
  }, [messages]);

  const avatars = [
    { id: 1, name: "Anandi", img: "https://i.postimg.cc/T16ypJY2/Anandi.jpg", description: "Beginner level" },
    { id: 2, name: "Ada", img: "https://i.postimg.cc/7hfgx65q/Ada.jpg", description: "Moderate level" },
    { id: 3, name: "Chandragupt", img: "https://i.postimg.cc/s2G1mNMD/Chandragupt.jpg", description: "Intermediate level" },
    { id: 4, name: "Alexander", img: "https://i.postimg.cc/QxNtwtFz/Hyp.jpg", description: "Advanced level" },
    { id: 5, name: "Tesla", img: "https://i.postimg.cc/qqy8F7gq/Alex.jpg", description: "Expert level" },
  ];

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

  const handleStartInterview = () => {
    if (selectedAvatarIndex !== null && selectedQuestionCount !== null) {
      setCurrentQuestion(1);
      setStage("chat");
    }
  };

  useEffect(() => {
    if (stage === "chat") {
      const formData = new FormData();
      formData.append("experience", experience);
      formData.append("skills", skills);
      formData.append("interview_type", interviewType);
      const chosenAvatar = avatars[selectedAvatarIndex];
      if (chosenAvatar) formData.append("level", chosenAvatar.description);

      fetch(`${CodingPracticeUrl}/start_interview`, {
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
          setMessages((prev) => [...prev, { sender: "bot", text: "Failed to start the interview.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        });
    }
  }, [stage, skills, experience, interviewType, selectedAvatarIndex]);

  const handleSendMessage = async () => {
    if (!userInput.trim() && !codeInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: userInput + (codeInput ? `\n\n[Code]:\n${codeInput}` : ""),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (currentQuestion === selectedQuestionCount) {
      try {
        const response = await fetch(`${CodingPracticeUrl}/next_question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, user_answer: userMessage.text, final: true }),
        });
        const data = await response.json();
        if (data.error) {
          setMessages((prev) => [...prev, { sender: "bot", text: data.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        } else {
          setMessages((prev) => [...prev, { sender: "bot", text: "Thank you for your answers. Generating your report...", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          setUserInput("");
          setCodeInput("");
          setIsReportLoading(true);

          setTimeout(async () => {
            const reportResponse = await fetch(`${CodingPracticeUrl}/finish_interview`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: sessionId }),
            });
            const report = await reportResponse.json();
            setReportData(report);
            setPopupType("report");
            setIsReportLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      return;
    }

    try {
      const response = await fetch(`${CodingPracticeUrl}/next_question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_answer: userMessage.text, final: false }),
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
    setCodeInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleCodeMode = () => {
    setIsCodeMode((prev) => !prev);
  };

  const handleEndTest = () => {
    navigate("/interview-practice");
  };

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
        onClick={handleStartInterview}
        disabled={selectedAvatarIndex === null || selectedQuestionCount === null}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
          selectedAvatarIndex === null || selectedQuestionCount === null 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
        }`}
      >
        Get started with Interview
      </button>
    </div>
  );

  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;
    return (
      <div className="flex flex-col md:flex-row w-full min-h-[95vh]">
        <div className="flex flex-col items-center justify-center p-4 w-full md:w-1/5 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg mb-4">
            {chosenAvatar && <img src={chosenAvatar.img} alt={chosenAvatar.name} className="w-full h-full object-cover" />}
          </div>
          {chosenAvatar && (
            <>
              <p className="text-xl font-semibold text-gray-800 mb-1">{chosenAvatar.name}</p>
              <p className="text-sm text-gray-600 mb-4 text-center">{chosenAvatar.description}</p>
            </>
          )}
         
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-3">Question {currentQuestion} of {selectedQuestionCount}</p>
            <button onClick={() => setPopupType("confirm")} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors">
              End Test
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-4/5 p-4">
          <div className="flex-1 min-h-[75vh] overflow-y-auto border border-gray-200 p-3 rounded-lg mb-4 bg-white shadow-md max-h-[75vh]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.sender === "bot" ? <BotMessage text={msg.text}  /> : msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
          
            <textarea
              rows={1}
              className="flex-1 border mt-4 border-gray-300 rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto max-h-24 w-full disabled:bg-gray-100"
              placeholder="Type here"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isReportLoading}
            />
              <button
              className={`p-2 rounded-full transition-transform ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={handleStartSpeechRecognition}
              title={isListening ? "Listening..." : "Click to Speak"}
            >
              {isListening ? (
                <svg className="w-6 h-6 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                </svg>
              ) : (
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                </svg>
              )}
            </button>
            <button
              onClick={handleToggleCodeMode}
              className={`p-2 rounded-full ${isCodeMode ? "bg-indigo-200 hover:bg-indigo-300" : "bg-gray-200 hover:bg-gray-300"}`}
              title="Toggle code mode"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              onClick={handleSendMessage}
              className={`px-4 py-2 rounded-full text-white font-semibold ${isReportLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              disabled={isReportLoading}
            >
              {isReportLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
        {isCodeMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Write Your Code</h3>
              <textarea
                className="w-full h-64 border border-gray-300 rounded-lg p-3 font-mono text-sm focus:outline-none shadow-sm"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Write your code here..."
              />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setIsCodeMode(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSendMessage();
                    setIsCodeMode(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative  md:rounded-lg min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-multiply blur-3xl opacity-30 bg-purple-400 -top-24 -left-24 animate-[blobAnimation_10s_infinite_ease-in-out]"></div>
        <div className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-multiply blur-3xl opacity-30 bg-pink-400 -bottom-24 right-0 animate-[blobAnimation_10s_infinite_ease-in-out]"></div>
        <div className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-multiply blur-3xl opacity-30 bg-blue-400 -bottom-24 left-20 animate-[blobAnimation_10s_infinite_ease-in-out]"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl bg-white bg-opacity-30 backdrop-blur-xl rounded-3xl shadow-lg border border-white border-opacity-20">
        {stage === "chooseAvatar" ? renderAvatarAndQuestionSelection() : renderChatInterface()}
        {popupType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {popupType === "confirm" ? (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">End Test Confirmation</h2>
                <p className="text-gray-600 mb-4">
                  You still have {selectedQuestionCount - currentQuestion + 1} questions remaining. If you proceed now you will not get a report. Do you want to proceed?
                </p>
                <div className="flex justify-center gap-4">
                  <button onClick={handleEndTest} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Yes
                  </button>
                  <button onClick={() => setPopupType(null)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : popupType === "report" && reportData ? (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Interview Report</h2>
                <div className="mb-6">
                  {reportData.marks_detail.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
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
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-800">Total Score: {reportData.total_score} / {reportData.max_score}</p>
                  <p className="text-gray-600 mb-2">Result: {reportData.result}</p>
                  <p className="text-gray-600 mb-4">Recommendations: {reportData.recommendations}</p>
                  <button onClick={handleEndTest} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Proceed
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeCodingInterview;

// Add this to your CSS file or <style> tag in your project for the blob animation
const styles = `
  @keyframes blobAnimation {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
  }
`;