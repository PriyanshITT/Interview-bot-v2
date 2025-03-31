

// JobRoleBasedInterview.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";
const flaskTestUrl = process.env.REACT_APP_TEST_URL;

const JobRoleBasedInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const avatarVideoRef = useRef(null);

  const [cameraError, setCameraError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stage, setStage] = useState("chooseAvatar");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [testDuration, setTestDuration] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState("");

  const {
    interviewType = "",
    role = "",
    fileName = "",
    file = null,
    experience = "",
    companyName = "",
    skills = "",
    knowledgeDomain = ""
  } = location.state || {};

  const avatars = [
    { id: 1, name: "Anandi", img: "https://i.postimg.cc/T16ypJY2/Anandi.jpg", 
      description: "Beginner level", video: "/videos/anandi.mp4", voiceName: "Google UK English Female" },
    { id: 2, name: "Ada", img: "https://i.postimg.cc/7hfgx65q/Ada.jpg", 
      description: "Moderate level", video: "/videos/ada.mp4", voiceName: "Google UK English Female" },
    { id: 3, name: "Chandragupt", img: "https://i.postimg.cc/s2G1mNMD/Chandragupt.jpg", 
      description: "Intermediate level", video: "/videos/chandragupt.mp4", voiceName: "Google UK English Male" },
    { id: 4, name: "Alexander", img: "https://i.postimg.cc/QxNtwtFz/Hyp.jpg", 
      description: "Advanced level", video: "/videos/hyp.mp4", voiceName: "Google US English Male" },
    { id: 5, name: "Tesla", img: "https://i.postimg.cc/qqy8F7gq/Alex.jpg", 
      description: "Expert level", video: "/videos/tesla.mp4", voiceName: "Google UK English Male" },
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

    recognition.onstart = () => {
      console.log("Speech recognition started...");
      setIsListening(true);
    };

    recognition.onspeechend = () => {
      console.log("Speech recognition ended...");
      recognition.stop();
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      console.log("Recognized Speech:", speechToText);
      setUserInput((prev) => prev + (prev ? " " : "") + speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error. Please try again.");
      setIsListening(false);
    };

    recognition.start();
  };

  const speakText = (text, selectedAvatarIndex) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      let voices = synth.getVoices();

      if (voices.length === 0) {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
          speakText(text, selectedAvatarIndex);
        };
        return;
      }

      const chosenAvatar = avatars[selectedAvatarIndex];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const selectedVoice = voices.find(v => v.name.includes(chosenAvatar.voiceName)) || voices[0];
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        if (avatarVideoRef.current) {
          if (!avatarVideoRef.current.src.includes(chosenAvatar.video)) {
            avatarVideoRef.current.src = chosenAvatar.video;
            avatarVideoRef.current.load();
          }
          if (avatarVideoRef.current.paused || avatarVideoRef.current.ended) {
            avatarVideoRef.current.play();
          }
        }
      };

      utterance.onend = () => {
        if (avatarVideoRef.current) {
          avatarVideoRef.current.pause();
        }
      };

      synth.speak(utterance);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getVideoTracks().forEach((track) => track.stop());
      cameraStreamRef.current.getAudioTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const startCameraStream = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          cameraStreamRef.current = stream;
          videoRef.current.srcObject = stream;
          setCameraError(null);
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
          setCameraError(
            "Unable to access the camera. Please check your device settings or visit webcamtests.com."
          );
        });
    }
  };

  useEffect(() => {
    if (stage === "chat" && selectedAvatarIndex !== null && videoRef.current && cameraActive) {
      startCameraStream();
    }
  }, [stage, selectedAvatarIndex, cameraActive]);

  const cameraActiveRef = useRef(cameraActive);
  useEffect(() => {
    cameraActiveRef.current = cameraActive;
  }, [cameraActive]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCameraStream();
      } else if (
        stage === "chat" &&
        selectedAvatarIndex !== null &&
        cameraActiveRef.current &&
        videoRef.current
      ) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "user" } })
          .then((stream) => {
            cameraStreamRef.current = stream;
            videoRef.current.srcObject = stream;
            setCameraError(null);
            alert("Please do not switch window during the interview!");
          })
          .catch((err) => {
            console.error("Error accessing camera: ", err);
            setCameraError(
              "Unable to access the camera. Please check your device settings or visit webcamtests.com."
            );
          });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCameraStream();
    };
  }, [stage, selectedAvatarIndex]);

  const handleToggleCamera = () => {
    if (cameraActive) {
      stopCameraStream();
      setCameraActive(false);
    } else {
      startCameraStream();
      setCameraActive(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (stage === "chat") {
      if (remainingTime === 0 && testDuration) {
        setRemainingTime(testDuration * 60);
      }
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleEndTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage, testDuration]);

  const handleStartInterview = () => {
    if (selectedAvatarIndex !== null && testDuration !== null) {
      setStage("chat");
    }
  };

  useEffect(() => {
    if (stage === "chat" && selectedAvatarIndex !== null) {
      const chosenAvatar = avatars[selectedAvatarIndex];
      const greetingText = "Hello! Let's start the Interview.";
      const greetingMessage = {
        sender: "bot",
        text: greetingText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages([greetingMessage]);
      speakText(greetingText, selectedAvatarIndex);

      setTimeout(() => {
        const formData = new FormData();
        formData.append("job_role", role);
        formData.append("experience", experience);
        formData.append("company_name", companyName);
        formData.append("skills", skills);
        formData.append("domain", knowledgeDomain);
        formData.append("resume", file);
        formData.append("level", avatars[selectedAvatarIndex].description);

        fetch(`${flaskTestUrl}/upload_resume`, {
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
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ]);
            } else {
              setSessionId(result.session_id);
              setQuestion(result.question);
              setMessages([
                {
                  sender: "bot",
                  text: result.question,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          });
      }, 3000);
    }
  }, [stage]);

  const handleSendMessage = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!userInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${flaskTestUrl}/next_question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: userInput,
          job_role: role,
          question: question,
          experience: experience,
          userId: user.id,
          username: user.username,
          level: avatars[selectedAvatarIndex].description,
          company_name: companyName,
          skills: skills,
          domain: knowledgeDomain
        }),
      });

      const data = await response.json();
      console.log("Raw backend response:", data);

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
        speakText(botMessage.text, selectedAvatarIndex);
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

  const handleToggleCodeMode = () => {
    setIsCodeMode((prev) => !prev);
  };

  const handleEndTest = () => {
    stopCameraStream();
    if (window.confirm("Your test is finished")) {
      navigate("/results");
    }
  };

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
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Please select test duration</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setTestDuration(15)}
            className={`px-4 py-2 rounded ${testDuration === 15 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            15 mins
          </button>
          <button
            onClick={() => setTestDuration(30)}
            className={`px-4 py-2 rounded ${testDuration === 30 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            30 mins
          </button>
          <button
            onClick={() => setTestDuration(50)}
            className={`px-4 py-2 rounded ${testDuration === 50 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            50 mins
          </button>
        </div>
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

  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;

    return (
      <div className="w-full relative flex flex-col md:flex-row min-h-[700px] ">
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded shadow-md text-gray-800 font-mono">
          {formatTime(remainingTime)}
        </div>
        <div className="md:w-1/5 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="rounded-full w-32 h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
            {chosenAvatar && (
              <video ref={avatarVideoRef} loop muted className="w-32 h-32 rounded-xl shadow-lg">
                <source src={avatars[selectedAvatarIndex]?.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          {chosenAvatar && (
            <>
              <p className="text-xl font-semibold mb-1 text-gray-800">{chosenAvatar.name}</p>
              <p className="text-sm text-gray-500 mb-4 text-center">{chosenAvatar.description}</p>
            </>
          )}
          <div className="mt-4">
            <video ref={videoRef} autoPlay muted playsInline className="w-64 h-48 object-cover rounded-xl shadow-lg border" />
            {cameraError && <div className="mt-2 text-sm text-red-500">{cameraError}</div>}
            <button
              onClick={handleEndTest}
              className="mt-8 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
            >
              End Test
            </button>
          </div>
        </div>
        <div className="md:w-4/5 flex flex-col p-6">
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
          <div className="h-[500px] overflow-y-auto border p-3 rounded-lg mb-4 bg-white shadow-md">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2 rounded-lg max-w-md text-sm ${
                    msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"
                  } whitespace-pre-wrap`}
                >
                  {msg.sender === "bot" ? <BotMessage text={msg.text} delay={15} /> : msg.text}
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
            />
            <button onClick={handleToggleCamera} className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none transition transform duration-200 ease-in-out">
              {cameraActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500 transition-transform transform hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0 0l16 16" />
                </svg>
              )}
            </button>
            <button
              className={`p-2 rounded-full text-gray-700 focus:outline-none ${isCodeMode ? "bg-indigo-200 hover:bg-indigo-300" : "bg-gray-200 hover:bg-gray-300"}`}
              title="Toggle code mode (expand the text area)"
              onClick={handleToggleCodeMode}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </button>
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
    <div className="relative w-full h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>
      <div className="relative z-10 w-full max-w-5xl p-4 md:p-8 bg-white/30 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20">
        {stage === "chooseAvatar" ? renderAvatarSelection() : renderChatInterface()}
      </div>
    </div>
  );
};

export default JobRoleBasedInterview;
