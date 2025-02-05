import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const InterviewTest = () => {
  const navigate = useNavigate();

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [interviewType, setInterviewType] = useState(null);
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [knowledgeDomain, setKnowledgeDomain] = useState("");
  const [file, setFile] = useState(null); // Resume or JD file

  // Open modal with type (Job Role or JD Interview)
  const openModal = (type) => {
    setInterviewType(type);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
    setRole("");
    setSkills("");
    setKnowledgeDomain("");
    setFile(null);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleLaunch = () => {
    if (!role || !skills || !knowledgeDomain || !file) {
      alert("Please fill all required fields and upload the necessary file.");
      return;
    }

    // Determine where to navigate
    const destination =
      interviewType === "job-role" ? "/job-role-interview" : "/job-description-interview";

    // Navigate with form data
    navigate(destination, {
      state: { role, skills, knowledgeDomain, fileName: file.name, interviewType },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden">
      {/* Decorative floating gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Main UI */}
      <div className="text-center p-8 z-10">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 drop-shadow-lg">
          AI Interview Test
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Job Role Based Interview Card */}
          <div
            className="h-64 p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
                       hover:shadow-2xl transition-all duration-300
                       transform hover:-translate-y-1 hover:scale-105 cursor-pointer
                       flex flex-col items-center justify-center"
            onClick={() => openModal("job-role")}
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

          {/* Job Description Based Interview Card */}
          <div
            className="h-64 p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
                       hover:shadow-2xl transition-all duration-300
                       transform hover:-translate-y-1 hover:scale-105 cursor-pointer
                       flex flex-col items-center justify-center"
            onClick={() => openModal("job-description")}
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

      {/* Modal for Form */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Start Your Next Interview</h2>

            {/* Role Selection */}
            <label className="block text-gray-700">Role</label>
            <select
              className="w-full p-2 border rounded-md mb-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select your Role (Required)</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="AI Specialist">AI Specialist</option>
              <option value="Other">Other</option>
            </select>

            {/* Skills Selection */}
            <label className="block text-gray-700">Select Key Skill(s)</label>
            <select
              className="w-full p-2 border rounded-md mb-3"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            >
              <option value="">Select a skill (Required)</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>

            {/* Knowledge Domain Selection */}
            <label className="block text-gray-700">Knowledge Domain (Specialization)</label>
            <select
              className="w-full p-2 border rounded-md mb-3"
              value={knowledgeDomain}
              onChange={(e) => setKnowledgeDomain(e.target.value)}
            >
              <option value="">Select a domain (Required)</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="NLP">NLP</option>
              <option value="Big Data">Big Data</option>
            </select>

            {/* File Upload */}
            <label className="block text-gray-700">
              {interviewType === "job-role" ? "Upload Resume" : "Upload Job Description"}
            </label>
            <input type="file" className="w-full p-2 border rounded-md mb-3" onChange={handleFileUpload} />

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={closeModal}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleLaunch}>
                Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewTest;
