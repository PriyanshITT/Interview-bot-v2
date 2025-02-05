import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const InterviewTest = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden">
      {/* Decorative floating gradient blobs in the background (optional) */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="text-center p-8 z-10">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 drop-shadow-lg">
          AI Interview Test
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div
            className="h-64 p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
                       hover:shadow-2xl transition-all duration-300
                       transform hover:-translate-y-1 hover:scale-105 cursor-pointer
                       flex flex-col items-center justify-center"
            onClick={() => navigate("/job-role-interview")}
          >
            <img
              src="https://img.icons8.com/color/96/briefcase--v1.png"
              alt="Job Role Interview"
              className="mb-4 w-20 h-20 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Job Role based Interview
            </h2>
          </div>

          <div
            className="h-64 p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
                       hover:shadow-2xl transition-all duration-300
                       transform hover:-translate-y-1 hover:scale-105 cursor-pointer
                       flex flex-col items-center justify-center"
            onClick={() => navigate("/job-description-interview")}
          >
            <img
              src="https://img.icons8.com/color/96/resume.png"
              alt="Job Description Interview"
              className="mb-4 w-20 h-20 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Job Description based Interview
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTest;
