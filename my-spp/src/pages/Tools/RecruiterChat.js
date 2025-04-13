// ResumeBuilder.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRobot } from "react-icons/fa";

export default function ResumeBuilder() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-[calc(100vh-60px)] pt-20 pb-8 px-4 flex flex-col items-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/04/39/69/99/360_F_439699926_GkaQTcxPchsvvtdrZ98cFQh1a8HQICwP.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
          Resume Builder
        </h1>
        <p className="text-base sm:text-lg text-white mt-2">
          Choose how you want your resume reviewed
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Human Recruiter Card */}
        <div
          className="relative w-full max-w-xs mx-auto p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 cursor-pointer transition-colors hover:bg-white/30"
          onClick={() => navigate("/human-recruiter")}
        >
          <div className="flex flex-col h-full justify-between items-center">
            <div className="w-full text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                Human Recruiter
              </h2>
              <p className="text-sm sm:text-base text-white mt-2">
                Get your resume analyzed by professional human recruiters.
              </p>
            </div>
            <div className="flex items-center justify-center my-4">
              <span className="text-6xl sm:text-7xl">👤</span>
            </div>
            <div className="w-full text-center">
              <span className="text-sm sm:text-base font-semibold text-white">
                → Click to Proceed
              </span>
            </div>
          </div>
        </div>

        {/* AI Recruiter Card */}
        <div
          className="relative w-full max-w-xs mx-auto p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 cursor-pointer transition-colors hover:bg-white/30"
          onClick={() => navigate("/ai-recruiter")}
        >
          <div className="flex flex-col h-full justify-between items-center">
            <div className="w-full text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                AI Recruiter
              </h2>
              <p className="text-sm sm:text-base text-white mt-2">
                Let AI analyze your resume and provide instant feedback.
              </p>
            </div>
            <div className="flex items-center justify-center my-4">
              <FaRobot className="w-20 h-20 sm:w-24 sm:h-24 text-white" />
            </div>
            <div className="w-full text-center">
              <span className="text-sm sm:text-base font-semibold text-white">
                → Click to Proceed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <button
        className="mt-8 flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft />
        Back to Home
      </button>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm sm:text-base text-white">
        For any queries, go to the{" "}
        <a href="/contact-us" className="text-purple-200 hover:underline">
          Contact Us
        </a>{" "}
        page.
      </p>
    </div>
  );
}