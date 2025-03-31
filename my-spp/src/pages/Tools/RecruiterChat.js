import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeBuilder() {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center h-[88vh] p-6"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/04/39/69/99/360_F_439699926_GkaQTcxPchsvvtdrZ98cFQh1a8HQICwP.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Human Recruiter Page Card */}
        <div
          className="relative w-80 h-96 p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigate("/human-recruiter")}
        >
          <div className="flex flex-col h-full justify-between items-center">
            <div className="w-full text-center mt-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Human Recruiter
              </h2>
              <p className="text-lg text-white">
                Get your resume analyzed by professional human recruiters.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-8xl">👤</span>
            </div>
            <div className="w-full text-center mb-4">
              <span className="text-lg font-semibold text-white">
                → Click to Proceed
              </span>
            </div>
          </div>
        </div>
        
        {/* AI Recruiter Page Card */}
        <div
          className="relative w-80 h-96 p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigate("/ai-recruiter")}
        >
          <div className="flex flex-col h-full justify-between items-center">
            <div className="w-full text-center mt-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                AI Recruiter
              </h2>
              <p className="text-lg text-white">
                Let AI analyze your resume and provide instant feedback.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://www.iconshock.com/image/RealVista/Development/chat_bot"
                alt="AI Chat Bot Icon"
                className="w-[7rem] h-[7rem]"
              />
            </div>
            <div className="w-full text-center mb-4">
              <span className="text-lg font-semibold text-white">
                → Click to Proceed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
