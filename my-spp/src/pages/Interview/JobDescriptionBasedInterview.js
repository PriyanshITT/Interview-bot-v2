import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";

const jdUrl = process.env.REACT_APP_JD_URL;

const JobDescriptionBasedInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEndTestModalOpen, setIsEndTestModalOpen] = useState(false);
  const { role = "Software Engineer", jobDescription = "" } = location.state || {};

  // Refs for camera stream, video element, messages end, and timer
  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const avatarVideoRef = useRef(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // State declarations
  const [cameraError, setCameraError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stage, setStage] = useState("chooseAvatar");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [testDuration, setTestDuration] = useState(null); // duration in minutes
  const [remainingTime, setRemainingTime] = useState(0); // remaining time in seconds
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false); // New state for tab switch warning

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

      const selectedVoice = voices.find((v) => v.name.includes(chosenAvatar.voiceName)) || voices[0];
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
    } else {
      console.error("Speech Synthesis not supported in this browser.");
    }
  };

  const avatars = [
    {
      id: 1,
      name: "Anandi",
      img: "https://i.postimg.cc/T16ypJY2/Anandi.jpg",
      description: "Beginner level",
      video: "/videos/anandi.mp4",
      voiceName: "Google UK English Female",
    },
    {
      id: 2,
      name: "Ada",
      img: "https://i.postimg.cc/7hfgx65q/Ada.jpg",
      description: "Moderate level",
      video: "/videos/ada.mp4",
      voiceName: "Google UK English Female",
    },
    {
      id: 3,
      name: "Chandragupt",
      img: "https://i.postimg.cc/s2G1mNMD/Chandragupt.jpg",
      description: "Intermediate level",
      video: "/videos/chandragupt.mp4",
      voiceName: "Google UK English Male",
    },
    {
      id: 4,
      name: "Alexander",
      img: "https://i.postimg.cc/QxNtwtFz/Hyp.jpg",
      description: "Advanced level",
      video: "/videos/hyp.mp4",
      voiceName: "Google US English Male",
    },
    {
      id: 5,
      name: "Tesla",
      img: "https://i.postimg.cc/qqy8F7gq/Alex.jpg",
      description: "Expert level",
      video: "/videos/tesla.mp4",
      voiceName: "Google UK English Male",
    },
  ];

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
      console.log("Camera stream fully stopped.");
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
          setCameraError("Unable to access the camera. Please check your device settings or visit webcamtests.com.");
        });
    }
  };

  useEffect(() => {
    if (stage === "chat" && selectedAvatarIndex !== null && videoRef.current && cameraActive) {
      console.log("Requesting camera access with facingMode 'user'...");
      startCameraStream();
    }
  }, [stage, selectedAvatarIndex, cameraActive]);

  const cameraActiveRef = useRef(cameraActive);
  useEffect(() => {
    cameraActiveRef.current = cameraActive;
  }, [cameraActive]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (stage === "chat") {
        if (document.hidden) {
          stopCameraStream();
          setTabSwitchWarning(true);
        } else {
          if (selectedAvatarIndex !== null && cameraActiveRef.current && videoRef.current) {
            navigator.mediaDevices
              .getUserMedia({ video: { facingMode: "user" } })
              .then((stream) => {
                cameraStreamRef.current = stream;
                videoRef.current.srcObject = stream;
                setCameraError(null);
                if (tabSwitchWarning) {
                  alert("Warning: Switching tabs is not allowed during the interview! Please stay on this tab.");
                }
              })
              .catch((err) => {
                console.error("Error accessing camera: ", err);
                setCameraError("Unable to access the camera. Please check your device settings or visit webcamtests.com.");
              });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCameraStream();
    };
  }, [stage, selectedAvatarIndex, tabSwitchWarning]);

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
        formData.append("job_description", jobDescription);
        formData.append("level", chosenAvatar.description);

        fetch(`${jdUrl}/start_interview`, {
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
              const botMessage = {
                sender: "bot",
                text: result.question,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              };
              setMessages((prev) => [...prev, botMessage]);
              speakText(botMessage.text, selectedAvatarIndex);
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
  }, [stage, selectedAvatarIndex, role, jobDescription]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${jdUrl}/next_question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_answer: userInput }),
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
      const newValue = userInput.substring(0, selectionStart) + indentation + userInput.substring(selectionEnd);
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
    setIsEndTestModalOpen(true);
  };

  const confirmEndTest = () => {
    setIsEndTestModalOpen(false);
    navigate("/results");
  };

  const cancelEndTest = () => {
    setIsEndTestModalOpen(false);
  };

  const renderAvatarSelection = () => (
    <div className="w-full flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
        Please choose your avatar and level of complexity
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-8 w-full max-w-6xl px-4">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`cursor-pointer flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 ${
              selectedAvatarIndex === index ? "border-2 border-indigo-500 text-white shadow-md " : "hover:shadow-xl"
            }`}
            onClick={() => setSelectedAvatarIndex(index)}
          >
            <div className="rounded-full w-20 h-20 overflow-hidden mb-3">
              <img src={avatar.img} alt={avatar.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">{avatar.name}</h3>
            <p className="text-sm text-gray-600 text-center mt-1">{avatar.description}</p>
          </div>
        ))}
      </div>
      <div className="mb-8 w-full max-w-md px-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">Please select test duration</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[15, 30, 50].map((duration) => (
            <button
              key={duration}
              onClick={() => setTestDuration(duration)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 w-24 ${
                testDuration === duration ? "bg-indigo-600 text-white shadow-md scale-105" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {duration} mins
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleStartInterview}
        disabled={selectedAvatarIndex === null || testDuration === null}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
          selectedAvatarIndex === null || testDuration === null ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
        }`}
      >
        Get started with Interview
      </button>
    </div>
  );

  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;
    return (
      <div className="w-full relative flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
        {isEndTestModalOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">End Test Confirmation</h2>
              <p className="text-gray-700 mb-6">Your test is finished. Are you sure you want to view your results?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelEndTest}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEndTest}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        {tabSwitchWarning && (
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border-l-4 border-purple-300 transform transition-all">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p className="text-red-600 dark:text-red-400 font-bold text-xl">Warning</p>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-lg mb-6">Do not switch tabs during the interview!</p>
              <button
                onClick={() => setTabSwitchWarning(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-300 to-pink-300 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                I Understand
              </button>
            </div>
          </div>
        )}
        {isCodeModalOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Code Editor</h2>
              <textarea
                rows={10}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto no-scrollbar"
                placeholder="Write your code here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setIsCodeModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSendMessage();
                    setIsCodeModalOpen(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Send Code
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-4 md:gap-6 max-w-7xl mx-auto w-full">
          <div className="md:w-1/4 flex flex-col items-center justify-center p-4 bg-white/80 rounded-xl shadow-lg">
            <div className="rounded-full w-32 h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
              {chosenAvatar && (
                <video ref={avatarVideoRef} loop muted className="w-full h-full object-cover rounded-xl">
                  <source src={avatars[selectedAvatarIndex]?.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            {chosenAvatar && (
              <>
                <p className="text-xl font-semibold mb-1 text-gray-800 text-center">{chosenAvatar.name}</p>
                <p className="text-sm text-gray-500 mb-4 text-center">{chosenAvatar.description}</p>
              </>
            )}
            <div className="mt-4 w-full">
              <video ref={videoRef} autoPlay muted playsInline className="w-full max-w-xs h-48 object-cover rounded-xl shadow-lg border mx-auto" />
              {cameraError && (
                <div className="mt-2 text-sm text-red-500 text-center">{cameraError}</div>
              )}
              <button onClick={handleEndTest} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md w-full">
                End Test
              </button>
              <div className="flex flex-row gap-x-4 mt-7 justify-center">
                <p className="text-gray-800 font-mono text-center">Time Remaining :</p>
                <div className="text-gray-800 font-mono">{formatTime(remainingTime)}</div>
              </div>
            </div>
          </div>
          <div className="md:w-3/4 max-h-[100vh] flex flex-col p-4 bg-white/80 rounded-xl shadow-lg">
            <div className="flex-1 min-h-[60vh] overflow-y-auto no-scrollbar border p-3 rounded-lg mb-4 bg-white shadow-md">
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
            <div className="flex flex-row md:flex-row items-center gap-2">
              <textarea
                rows={isCodeMode ? 10 : 1}
                className={`flex-1 mt-4 border rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto no-scrollbar ${
                  isCodeMode ? "max-h-64" : "max-h-24"
                } w-full`}
                placeholder="Type here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
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
                <button onClick={handleToggleCamera} className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98zM16 18H4V6h12v12z" />
                  </svg>
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
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

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center">
      {stage === "chooseAvatar" ? renderAvatarSelection() : renderChatInterface()}
    </div>
  );
};

export default JobDescriptionBasedInterview;