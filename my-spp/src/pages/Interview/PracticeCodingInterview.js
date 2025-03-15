import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";
const CodingPracticeUrl = process.env.REACT_APP_CODING_URL;

const PracticeCodingInterview = () => {
  // Grab the form data passed from PracticeTest
  const location = useLocation();
  const navigate = useNavigate();
  const {
    experience = "",
    skills = "",
    interviewType = "Coding Interview",
  } = location.state || {};

  console.log({ skills, experience, interviewType });
  const [isListening, setIsListening] = useState(false);

  // Page stage: "chooseAvatar" or "chat"
  const [stage, setStage] = useState("chooseAvatar");

  // Which avatar is selected
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);

  // New state: number of questions selected (15, 25, or 40)
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);

  // New state: track the current question number (starts at 1 when chat begins)
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Toggle for code mode (expanded textarea)
  const [isCodeMode, setIsCodeMode] = useState(false);

  // Session ID from backend for the interview conversation
  const [sessionId, setSessionId] = useState(null);

  // New state: popup type ("final" for finishing, "confirm" for end test confirmation, or null)
  const [popupType, setPopupType] = useState(null);

  // Store the report data returned from backend
  const [reportData, setReportData] = useState(null);

  // New state for report loading
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Sample Avatars (unchanged)

  const avatars = [
    { id: 1, name: "Anandi", img: "https://i.postimg.cc/T16ypJY2/Anandi.jpg", description: "Beginner level" },
    { id: 2, name: "Ada", img: "https://i.postimg.cc/7hfgx65q/Ada.jpg", description: "Moderate level" },
    { id: 3, name: "Chandragupt", img: "https://i.postimg.cc/s2G1mNMD/Chandragupt.jpg", description: "Intermediate level" },
    { id: 4, name: "Alexander", img: "https://i.postimg.cc/QxNtwtFz/Hyp.jpg", description: "Advanced level" },
    { id: 5, name: "Tesla", img: "https://i.postimg.cc/qqy8F7gq/Alex.jpg", description: "Expert level" },
  ];

  // Chat messages (unchanged)
  const [messages, setMessages] = useState([]);

  // Tracks user’s typed chat input
  const [userInput, setUserInput] = useState("");

  // Ref to auto-scroll to bottom of the chat
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);




 const handleStartSpeechRecognition = () => {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false; // Stop automatically after speaking
  recognition.interimResults = false; // Only take final results
  recognition.lang = "en-US"; // Set language to English

  recognition.onstart = () => {
    console.log("Speech recognition started...");
    setIsListening(true);  // ✅ Set mic ON
  };

  recognition.onspeechend = () => {
    console.log("Speech recognition ended...");
    recognition.stop();
    setIsListening(false); // ✅ Set mic OFF
  };

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    console.log("Recognized Speech:", speechToText);
    setUserInput((prev) => prev + (prev ? " " : "") + speechToText); // Append text to user input
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("Speech recognition error. Please try again.");
    setIsListening(false); // ✅ Set mic OFF in case of error
  };

  recognition.start();
};




  // Switch from avatar selection to chat and initialize the interview session.
  // Now also check that a question count has been selected.
  const handleStartInterview = () => {
    if (selectedAvatarIndex !== null && selectedQuestionCount !== null) {
      setCurrentQuestion(1);
      setStage("chat");
    }
  };

  // When the chat stage starts, initialize the interview by calling the backend.
  useEffect(() => {
    if (stage === "chat") {
      const formData = new FormData();
      formData.append("experience", experience);
      formData.append("skills", skills);
      formData.append("interview_type", interviewType);
      // Optionally, send the chosen avatar's level
      const chosenAvatar = avatars[selectedAvatarIndex];
      if (chosenAvatar) {
        formData.append("level", chosenAvatar.description);
      }
      fetch(`${CodingPracticeUrl}/start_interview`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            console.error("Error:", result.error);
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
            setSessionId(result.session_id);
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
  }, [stage, skills, experience, interviewType, selectedAvatarIndex]);

  // Send a new user message and call the backend for the next question.
  // If it's the final question, show a final popup.
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // If it's the final question, append a final bot message and show final popup after 2 seconds.
    // if (currentQuestion >= selectedQuestionCount) {
    //   const finalBotMessage = {
    //     sender: "bot",
    //     text: "Thank you for your answers. Your test will now end shortly.",
    //     time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    //   };
    //   setMessages((prev) => [...prev, finalBotMessage]);
    //   setUserInput("");
    //   setTimeout(() => setPopupType("final"), 2000);
    //   return;
    // }
    // Check if this is the final question answer
    if (currentQuestion === selectedQuestionCount) {
      // For the final answer, call /next_question with a "final" flag
      try {
        const response = await fetch(`${CodingPracticeUrl}/next_question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_answer: userInput,
            final: true, // flag to indicate this is the final answer
          }),
        });
        const data = await response.json();
        if (data.error) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: data.error,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } else {
          // Optionally display a confirmation message
          const finalBotMessage = {
            sender: "bot",
            text: "Thank you for your answers. Generating your report...",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, finalBotMessage]);
          setUserInput("");
          // Set loading to true so that inputs are disabled and a loading indicator can be shown
          setIsReportLoading(true);

          // Now generate the report
          setTimeout(async () => {
            try {
              const reportResponse = await fetch(`${CodingPracticeUrl}/finish_interview`, {
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
            // Once report is generated, remove loading flag
            setIsReportLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Error sending final answer:", error);
      }
      // Do not update currentQuestion further
      return;
    }

    try {
      const response = await fetch(`${CodingPracticeUrl}/next_question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: userInput,
          final: false,
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
        setCurrentQuestion((prev) => prev + 1);
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

  // Keydown handler for textarea (unchanged)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      return;
    }
    if (isCodeMode && e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const indentation = "    ";
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

  // Toggle code mode (unchanged)
  const handleToggleCodeMode = () => {
    setIsCodeMode((prev) => !prev);
  };

  // Placeholder for mic button (unchanged)
  const handleMicClick = () => {
    alert("Mic button clicked (placeholder). Integrate speech recognition here!");
  };

  // New: End Test handler that simply navigates to Interview Test
  const handleEndTest = () => {
    navigate("/ai-interview-test");
  };

  // Render the avatar selection screen with integrated question count selection.
  // When an avatar is selected, show the question count options (default buttons are gray until one is selected).
  const renderAvatarAndQuestionSelection  = () => (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Please choose your avatar and level of complexity
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-8">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`cursor-pointer flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border transition-transform hover:scale-105 ${selectedAvatarIndex === index ? "ring-4 ring-indigo-500" : ""
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
      {/* If an avatar is selected, show question count selection options */}
      {selectedAvatarIndex !== null && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Please select the number of questions
          </h2>
          <div className="flex space-x-4 mb-8">
            {[15, 25, 40].map((count) => (
              <button
                key={count}
                onClick={() => setSelectedQuestionCount(count)}
                className={`px-6 py-3 rounded-lg text-white font-semibold ${selectedQuestionCount === count ? "bg-indigo-600" : "bg-gray-400 hover:bg-gray-500"
                  }`}
              >
                {count}
              </button>
            ))}
          </div>
          <button
            onClick={handleStartInterview}
            disabled={selectedQuestionCount === null}
            className={`px-6 py-3 rounded-lg text-white font-semibold ${selectedQuestionCount === null
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            Get started with Interview
          </button>
        </div>
      )}
    </div>
  );

  // Render the chat interface with question counter in the header and End Test button.
  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;
    return (
      <div className="w-full flex flex-col md:flex-row min-h-[700px]">
        <div className="md:w-1/5 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="rounded-full w-32 h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
            {chosenAvatar && <img src={chosenAvatar.img} alt={chosenAvatar.name} className="w-full h-full object-cover" />}
          </div>
          {chosenAvatar && (
            <>
              <p className="text-xl font-semibold mb-1 text-gray-800">{chosenAvatar.name}</p>
              <p className="text-sm text-gray-500 mb-4 text-center">{chosenAvatar.description}</p>
            </>
          )}
          <div className="w-48 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            <p className="text-xs text-gray-400">Voice Wave</p>
          </div>
        </div>
        <div className="md:w-4/5 flex flex-col p-6 relative">
          <button onClick={() => setPopupType("confirm")} className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md">
            End Test
          </button>
          <div className="flex flex-col mb-3">
            <div className="flex items-center">
              {chosenAvatar && (
                <div className="w-10 h-10 mr-2">
                  <img src={chosenAvatar.img} alt="Bot Avatar" className="rounded-full object-cover w-full h-full" />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-800">
                {chosenAvatar ? `${chosenAvatar.name} Bot` : "Interview Bot"}
              </h2>
            </div>
            <div className="mt-2 text-gray-600">
              Question {currentQuestion} of {selectedQuestionCount}
            </div>
          </div>
          <div className="h-[500px] overflow-y-auto border p-3 rounded-lg mb-4 bg-white shadow-md">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2 rounded-lg max-w-md text-sm ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"} whitespace-pre-wrap`}>
                  {msg.sender === "bot" ? <BotMessage text={msg.text} delay={150} /> : msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center space-x-2">
  



          <button
              className={`p-2 rounded-full focus:outline-none transition-transform transform ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={handleStartSpeechRecognition}
              title={isListening ? "Listening..." : "Click to Speak"}
            >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                </svg>
              )}
            </button>





            <textarea
              rows={isCodeMode ? 10 : 1}
              className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto ${isCodeMode ? "max-h-64" : "max-h-24"}`}
              placeholder="Type your message. (Enter=Send, Shift+Enter=New line)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isReportLoading}
            />
            <button onClick={handleToggleCodeMode} className={`p-2 rounded-full text-gray-700 focus:outline-none ${isCodeMode ? "bg-indigo-200 hover:bg-indigo-300" : "bg-gray-200 hover:bg-gray-300"}`} title="Toggle code mode (expand the text area)" disabled={isReportLoading}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </button>
            <button onClick={handleSendMessage} className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md" disabled={isReportLoading}>
              {isReportLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>
      <div className="relative z-10 w-full max-w-5xl p-4 md:p-8 bg-white/30 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20">
        {stage === "chooseAvatar" ? renderAvatarAndQuestionSelection() : renderChatInterface()}
        {popupType && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {popupType === "confirm" ? (
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">End Test Confirmation</h2>
                <p className="mb-4">
                  You still have {selectedQuestionCount - currentQuestion + 1} questions remaining. If you proceed now you will not get report. Do you want to proceed?
                </p>
                <div className="flex justify-center space-x-4">
                  <button onClick={handleEndTest} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Yes
                  </button>
                  <button onClick={() => setPopupType(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Cancel
                  </button>
                </div>
              </div>
            ) : popupType === "report" && reportData ? (
              <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-6 text-center">Interview Report</h2>
                <div className="space-y-4">
                  {reportData.marks_detail.map((item, index) => (
                    <div key={index} className="p-4 border rounded">
                      <p className="font-semibold">Question {index + 1}:</p>
                      <p className="mb-2">{item.question}</p>
                      <p className="font-semibold">Your Answer:</p>
                      <p className="mb-2">{item.answer}</p>
                      <p className="font-semibold">Correct Answer:</p>
                      <pre className="mb-2 whitespace-pre-wrap bg-gray-100 p-2 rounded">
  {item.correct_answer}
</pre>
                      <p>
                        Score: <span className="font-semibold">{item.score}</span> / {item.max_score}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4">
                  <p className="mb-2 font-semibold">
                    Total Score: {reportData.total_score} / {reportData.max_score}
                  </p>
                  <p className="mb-2">Result: {reportData.result}</p>
                  <p className="mb-4">Recommendations: {reportData.recommendations}</p>
                  <button onClick={handleEndTest} className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">
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
