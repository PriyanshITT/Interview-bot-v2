import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeBuilder() {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-8"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/04/39/69/99/360_F_439699926_GkaQTcxPchsvvtdrZ98cFQh1a8HQICwP.jpg')",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Human Recruiter Page Card */}
        <div
          className="relative w-80 h-96 p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigate("/human-recruiter")}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4 drop-shadow-lg">
            Human Recruiter
          </h2>
          <p className="text-lg text-white text-center">
            Get your resume analyzed by professional human recruiters.
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-white">
            → Click to Proceed
          </div>
        </div>

        {/* AI Recruiter Page Card */}
        <div
          className="relative w-80 h-96 p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigate("/ai-recruiter")}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4 drop-shadow-lg">
            AI Recruiter
          </h2>
          <p className="text-lg text-white text-center">
            Let AI analyze your resume and provide instant feedback.
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-white">
            → Click to Proceed
          </div>
        </div>
      </div>
    </div>
  );
}
