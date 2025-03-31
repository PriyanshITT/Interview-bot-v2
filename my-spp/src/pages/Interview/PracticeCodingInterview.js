import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";
import "./PracticeCodingInterview.css";

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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
    navigate("/ai-interview-test");
  };

  const renderAvatarAndQuestionSelection = () => (
    <div className="avatar-selection-container">
      <h1 className="avatar-selection-title">Please choose your avatar and level of complexity</h1>
      <div className="avatar-grid">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`avatar-card ${selectedAvatarIndex === index ? "avatar-selected" : ""}`}
            onClick={() => setSelectedAvatarIndex(index)}
          >
            <div className="avatar-image-container">
              <img src={avatar.img} alt={avatar.name} className="avatar-image" />
            </div>
            <div className="avatar-text">
              <h3 className="avatar-name">{avatar.name}</h3>
              <p className="avatar-description">{avatar.description}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedAvatarIndex !== null && (
        <div className="question-count-container">
          <h2 className="question-count-title">Please select the number of questions</h2>
          <div className="question-count-buttons">
            {[5, 10, 15].map((count) => (
              <button
                key={count}
                onClick={() => setSelectedQuestionCount(count)}
                className={`question-count-button ${selectedQuestionCount === count ? "selected" : ""}`}
              >
                {count}
              </button>
            ))}
          </div>
          <button
            onClick={handleStartInterview}
            disabled={selectedQuestionCount === null}
            className={`start-interview-button ${selectedQuestionCount === null ? "disabled" : ""}`}
          >
            Get started with Interview
          </button>
        </div>
      )}
    </div>
  );

  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;
    return (
      <div className="chat-container">
        <div className="sidebar1">
          <div className="avatar-profile">
            {chosenAvatar && <img src={chosenAvatar.img} alt={chosenAvatar.name} className="avatar-profile-image" />}
          </div>
          {chosenAvatar && (
            <>
              <p className="avatar-profile-name">{chosenAvatar.name}</p>
              <p className="avatar-profile-description">{chosenAvatar.description}</p>
            </>
          )}
          <div className="voice-wave">Voice Wave</div>
          <div className="sidebar-info">
            <div className="chat-header-question-count">Question {currentQuestion} of {selectedQuestionCount}</div>
            <button onClick={() => setPopupType("confirm")} className="end-test-button">End Test</button>
          </div>
        </div>
        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                <div className="message-content">
                  {msg.sender === "bot" ? <BotMessage text={msg.text} delay={15} /> : msg.text}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-container">
            <button
              className={`mic-button ${isListening ? "listening" : ""}`}
              onClick={handleStartSpeechRecognition}
              title={isListening ? "Listening..." : "Click to Speak"}
            >
              {isListening ? (
                <svg className="mic-icon animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                </svg>
              ) : (
                <svg className="mic-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                </svg>
              )}
            </button>
            <textarea
              rows={1}
              className="chat-input"
              placeholder="Type your message. (Enter=Send, Shift+Enter=New line)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isReportLoading}
            />
            <button onClick={handleToggleCodeMode} className={`code-mode-button ${isCodeMode ? "active" : ""}`} title="Toggle code mode">
              <svg className="code-mode-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </button>
            <button onClick={handleSendMessage} className="send-button" disabled={isReportLoading}>
              {isReportLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
        {isCodeMode && (
          <div className="code-popup">
            <div className="code-popup-content">
              <h3 className="code-popup-title">Write Your Code</h3>
              <textarea
                className="code-textarea"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Write your code here..."
              />
              <div className="code-popup-buttons">
                <button onClick={() => setIsCodeMode(false)} className="code-popup-close">Close</button>
                <button onClick={() => { handleSendMessage(); setIsCodeMode(false); }} className="code-popup-submit">Submit Code</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="main-container">
        {stage === "chooseAvatar" ? renderAvatarAndQuestionSelection() : renderChatInterface()}
        {popupType && (
          <div className="popup-overlay">
            {popupType === "confirm" ? (
              <div className="popup">
                <h2 className="popup-title">End Test Confirmation</h2>
                <p className="popup-text">
                  You still have {selectedQuestionCount - currentQuestion + 1} questions remaining. If you proceed now you will not get a report. Do you want to proceed?
                </p>
                <div className="popup-buttons">
                  <button onClick={handleEndTest} className="popup-button yes">Yes</button>
                  <button onClick={() => setPopupType(null)} className="popup-button cancel">Cancel</button>
                </div>
              </div>
            ) : popupType === "report" && reportData ? (
              <div className="report-popup">
                <h2 className="report-title">Interview Report</h2>
                <div className="report-content">
                  {reportData.marks_detail.map((item, index) => (
                    <div key={index} className="report-item">
                      <p className="report-question">Question {index + 1}:</p>
                      <p className="report-text">{item.question}</p>
                      <p className="report-answer-label">Your Answer:</p>
                      <p className="report-text">{item.answer}</p>
                      <p className="report-answer-label">Correct Answer:</p>
                      <pre className="report-correct-answer">{item.correct_answer}</pre>
                      <p className="report-score">Score: <span>{item.score}</span> / {item.max_score}</p>
                    </div>
                  ))}
                </div>
                <div className="report-summary">
                  <p className="report-total-score">Total Score: {reportData.total_score} / {reportData.max_score}</p>
                  <p className="report-result">Result: {reportData.result}</p>
                  <p className="report-recommendations">Recommendations: {reportData.recommendations}</p>
                  <button onClick={handleEndTest} className="report-proceed-button">Proceed</button>
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
