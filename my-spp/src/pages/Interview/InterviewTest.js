import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InterviewTest = () => {
  const navigate = useNavigate();
  
  // Modal state and common form fields
  const [isOpen, setIsOpen] = useState(false);
  const [interviewType, setInterviewType] = useState(null);
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  // Additional fields for job-role based interview
  const [experience, setExperience] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [skills, setSkills] = useState("");
  const [customSkills, setCustomSkills] = useState("");
  const [knowledgeDomain, setKnowledgeDomain] = useState("");
  const [customKnowledgeDomain, setCustomKnowledgeDomain] = useState("");

  // Open modal with interview type
  const openModal = (type) => {
    setInterviewType(type);
    setIsOpen(true);
  };

  // Close modal and reset fields
  const closeModal = () => {
    setIsOpen(false);
    setRole("");
    setCustomRole("");
    setFile(null);
    setExperience("");
    setCompanyName("");
    setCustomCompanyName("");
    setSkills("");
    setCustomSkills("");
    setKnowledgeDomain("");
    setCustomKnowledgeDomain("");
    setJobDescription("");
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  // Get final values from dropdowns
  const getFinalValue = (value, customValue) => {
    return value === "Other" ? customValue : value;
  };

  // Handle form submission
  const handleLaunch = () => {
    if (interviewType === "job-role") {
      if (
        !experience ||
        !role ||
        (role === "Other" && !customRole) ||
        !skills ||
        (skills === "Other" && !customSkills) ||
        !knowledgeDomain ||
        (knowledgeDomain === "Other" && !customKnowledgeDomain) ||
        !companyName ||
        (companyName === "Other" && !customCompanyName) ||
        !file
      ) {
        alert("Please fill all required fields and upload your resume.");
        return;
      }
    } else {
      if (!role || (role === "Other" && !customRole) || !jobDescription) {
        alert("Please select a job role and enter the job description.");
        return;
      }
    }

    const finalRole = getFinalValue(role, customRole);
    const finalSkills = getFinalValue(skills, customSkills);
    const finalKnowledgeDomain = getFinalValue(knowledgeDomain, customKnowledgeDomain);
    const finalCompanyName = getFinalValue(companyName, customCompanyName);

    const data = {
      interviewType,
      role: finalRole,
      jobDescription,
      experience,
      companyName: finalCompanyName,
      skills: finalSkills,
      knowledgeDomain: finalKnowledgeDomain,
      fileName: file ? file.name : "",
    };

    const destination = interviewType === "job-role" ? "/job-role-interview" : "/job-description-interview";
    navigate(destination, { state: { ...data, file } });
  };

  return (
    <div className="relative  min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Decorative Floating Blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Main UI */}
      <div className="text-center p-4 sm:p-8 z-10 w-full max-w-5xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 drop-shadow-lg">
          AI Interview Test
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mx-auto">
          {/* Job Role Based Interview Card */}
          <div
            className="h-64 p-6 sm:p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
                       hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => openModal("job-role")}
          >
            <img
              src="https://img.icons8.com/color/96/briefcase--v1.png"
              alt="Job Role Interview"
              className="mb-4 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Job Role based Interview
            </h2>
          </div>

          {/* Job Description Based Interview Card */}
          <div
            className="h-64 p-6 sm:p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
                       hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => openModal("job-description")}
          >
            <img
              src="https://img.icons8.com/color/96/resume.png"
              alt="Job Description Interview"
              className="mb-4 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Job Description based Interview
            </h2>
          </div>
        </div>
      </div>

      {/* Modal for Form */}
      {isOpen && (
        <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[75vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {interviewType === "job-role"
                ? "Job Role Interview Details"
                : "Job Description Interview Details"}
            </h2>

            {/* Scrollable Form Container */}
            <div className="space-y-3">
              {interviewType === "job-role" ? (
                <>
                  {/* Experience */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Experience</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Enter your experience (e.g., 3 years)"
                    />
                  </div>

                  {/* Company Name Dropdown */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Company Name</label>
                    <select
                      class      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    >
                      <option value="">Select Company Name (Required)</option>
                      <option value="Google">Google</option>
                      <option value="Microsoft">Microsoft</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Other">Other</option>
                    </select>
                    {companyName === "Other" && (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mt-2 text-sm sm:text-base"
                        value={customCompanyName}
                        onChange={(e) => setCustomCompanyName(e.target.value)}
                        placeholder="Enter your company name"
                      />
                    )}
                  </div>

                  {/* Role Dropdown */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Role</label>
                    <select
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select your Role (Required)</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="AI Specialist">AI Specialist</option>
                      <option value="Other">Other</option>
                    </select>
                    {role === "Other" && (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mt-2 text-sm sm:text-base"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="Enter your role"
                      />
                    )}
                  </div>

                  {/* Skills Dropdown */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Skills</label>
                    <select
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    >
                      <option value="">Select a skill (Required)</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Engineering">Data Engineering</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Other">Other</option>
                    </select>
                    {skills === "Other" && (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mt-2 text-sm sm:text-base"
                        value={customSkills}
                        onChange={(e) => setCustomSkills(e.target.value)}
                        placeholder="Enter your skill"
                      />
                    )}
                  </div>

                  {/* Knowledge Domain Dropdown */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Knowledge Domain</label>
                    <select
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      value={knowledgeDomain}
                      onChange={(e) => setKnowledgeDomain(e.target.value)}
                    >
                      <option value="">Select a domain (Required)</option>
                      <option value="Computer Vision">Computer Vision</option>
                      <option value="NLP">NLP</option>
                      <option value="Big Data">Big Data</option>
                      <option value="Other">Other</option>
                    </select>
                    {knowledgeDomain === "Other" && (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mt-2 text-sm sm:text-base"
                        value={customKnowledgeDomain}
                        onChange={(e) => setCustomKnowledgeDomain(e.target.value)}
                        placeholder="Enter your domain"
                      />
                    )}
                  </div>

                  {/* File Upload for Resume */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Upload Resume</label>
                    <input
                      type="file"
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      onChange={handleFileUpload}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* For Job Description Interview */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Job Role</label>
                    <select
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select Job Role (Required)</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="AI Specialist">AI Specialist</option>
                      <option value="Other">Other</option>
                    </select>
                    {role === "Other" && (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mt-2 text-sm sm:text-base"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="Enter your role"
                      />
                    )}
                  </div>

                  {/* Job Description Input Field */}
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base">Job Description</label>
                    <textarea
                      className="w-full p-2 border rounded-md h-24 sm:h-32 text-sm sm:text-base"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Enter job description here"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 rounded-md text-sm sm:text-base" 
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
                onClick={handleLaunch}
              >
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