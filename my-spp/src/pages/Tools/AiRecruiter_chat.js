import React, { useState } from "react";
import {
  SiApple,
  SiNvidia,
  SiOracle,
  SiAmazon,
  SiGoogle,
  SiTesla,
  SiInfosys,
  SiTcs,
  SiWipro,
  SiHcl,
} from "react-icons/si";
import { FaMicrosoft, FaRobot, FaTrash, FaClock, FaBuilding } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AiRecruiterChat() {
  const [selectedCompany, setSelectedCompany] = useState("Apple");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello, I am a recruiter at Apple. I'm here to answer any questions about recruitment, interviews, and company culture.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);

  const companies = [
    { name: "Apple", icon: <SiApple /> },
    { name: "Microsoft", icon: <FaMicrosoft /> },
    { name: "Google", icon: <SiGoogle /> },
    { name: "NVIDIA", icon: <SiNvidia /> },
    { name: "Oracle", icon: <SiOracle /> },
    { name: "Amazon", icon: <SiAmazon /> },
    { name: "Tesla", icon: <SiTesla /> },
    { name: "Infosys", icon: <SiInfosys /> },
    { name: "TCS", icon: <SiTcs /> },
    { name: "Wipro", icon: <SiWipro /> },
    { name: "HCL", icon: <SiHcl /> },
    { name: "Tech Mahindra", icon: <FaBuilding /> }, // No specific icon in react-icons, using generic
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
    if (!input.trim() || typing) return;

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
      setTyping(false);
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

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hello, I am a recruiter at ${selectedCompany}. I'm here to answer any questions about recruitment, interviews, and company culture.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Subtle animation for mounting components
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Subtle animation for messages
  const messageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col min-h-[calc(100vh-60px)] bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 px-4 pt-20 pb-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md">
          AI Recruiter Chat
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white mt-2">
          Connect with virtual recruiters from top companies
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl mx-auto">
        {/* Sidebar */}
        <div className="w-full sm:w-80 lg:w-64 bg-white/90 backdrop-blur-sm shadow-lg p-4 rounded-xl h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <FaRobot /> Recruiters
          </h2>
          <div className="space-y-2">
            {companies.map(({ name, icon }) => (
              <button
                key={name}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedCompany === name
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-md"
                    : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleCompanyChange(name)}
              >
                <span className="mr-3 text-lg sm:text-xl">{icon}</span>
                <span className="text-sm sm:text-base">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm shadow-lg rounded-xl h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[calc(100vh-80px)]">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Chat with {selectedCompany} Recruiter
            </h3>
            <div className="flex gap-2">
              <button
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                onClick={() => setShowTimestamps(!showTimestamps)}
                title={showTimestamps ? "Hide Timestamps" : "Show Timestamps"}
              >
                <FaClock className="text-base sm:text-lg" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                onClick={clearChat}
                title="Clear Chat"
              >
                <FaTrash className="text-base sm:text-lg" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-h-[60vh] max-h-[60vh] no-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={messageVariants}
                  className={`flex items-start my-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white mr-2">
                      <FaRobot className="text-base sm:text-lg" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[80%] sm:max-w-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm"
                        : "bg-gray-50 border border-gray-200 text-gray-800 shadow-sm"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm md:text-base">
                      {msg.content}
                    </pre>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm text-xs sm:text-sm md:text-base"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={typing}
            />
            <button
              className="p-2 sm:p-3 mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-sm text-xs sm:text-sm md:text-base disabled:opacity-50"
              onClick={sendMessage}
              disabled={typing}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs sm:text-sm md:text-base text-white">
        For any queries, go to the{" "}
        <a href="/contact-us" className="text-purple-200 hover:underline">
          Contact Us
        </a>{" "}
        page.
      </p>

      {/* Inline CSS for hiding scrollbars */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </motion.div>
  );
}