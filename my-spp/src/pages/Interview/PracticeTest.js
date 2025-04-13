import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PracticeTest = () => {
  const navigate = useNavigate();

  // Controls whether the modal is visible
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [skillsOther, setSkillsOther] = useState("");
  const [domain, setDomain] = useState("");
  const [domainOther, setDomainOther] = useState("");
  // Default interviewType is "General"
  const [interviewType, setInterviewType] = useState("General");

  // Sample skill suggestions
  const skillSuggestions = [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "CI/CD",
    "SQL",
    "NoSQL",
    "Other",
  ];

  const codingSkillSuggestions = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "other"
  ];

  // Domain options
  const domainOptions = [
    "General",
    "Computer Vision",
    "NLP",
    "Data Visualization",
    "Big Data",
    "Cloud Architecture",
    "MLOps",
    "Business Intelligence",
    "Other",
  ];

  // Open/close the modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Check if all required fields are filled
  const isFormValid = () => {
    const experienceFilled = experience.trim() !== "";
    const skillsFilled =
      skills && (skills !== "Other" || (skills === "Other" && skillsOther));
    let domainFilled = true;
    if (interviewType === "General") {
      domainFilled = domain && (domain !== "Other" || (domain === "Other" && domainOther));
    }
    return experienceFilled && skillsFilled && domainFilled;
  };

  // On Launch, navigate to the interview page with form data
  const handleLaunch = () => {
    if (!isFormValid()) return;

    const formData = {
      experience,
      skills: skills === "Other" ? skillsOther : skills,
      knowledgeDomain: interviewType === "General" 
        ? (domain === "Other" ? domainOther : domain) 
        : null,
      interviewType,
    };

    const destination =
      interviewType === "General" ? "/start-general-interview" : "/start-coding-interview";
    navigate(destination, { state: formData });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Decorative floating gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="text-center p-4 sm:p-8 z-10 w-full max-w-5xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 drop-shadow-lg">
          Interview Practice
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mx-auto">
          {/* General Interview Card */}
          <div
            className="h-64 p-6 sm:p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
            hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => {
              setInterviewType("General");
              handleOpenModal();
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/laptop.png"
              alt="General Interview"
              className="mb-4 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              General Interview
            </h2>
          </div>

          {/* Coding Interview Card */}
          <div
            className="h-64 p-6 sm:p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
            hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => {
              setInterviewType("Coding Interview");
              handleOpenModal();
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/code.png"
              alt="Coding Interview"
              className="mb-4 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Coding Interview
            </h2>
          </div>
        </div>
      </div>

      {/* Modal for Interview */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Start Your Next Interview
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {/* Experience */}
              <div>
                <label className="block text-gray-700 text-sm sm:text-base mb-1 font-medium">
                  Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Enter your experience in years"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-gray-700 text-sm sm:text-base mb-1 font-medium">
                  Select Key Skill(s)
                </label>
                <select
                  value={skills}
                  onChange={(e) => {
                    setSkills(e.target.value);
                    if (e.target.value !== "Other") setSkillsOther("");
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none text-sm sm:text-base"
                >
                  <option value="">Select a skill (Required)</option>
                  {(interviewType === "Coding Interview" ? codingSkillSuggestions : skillSuggestions).map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                {skills === "Other" && (
                  <input
                    type="text"
                    placeholder="Enter your skill"
                    value={skillsOther}
                    onChange={(e) => setSkillsOther(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mt-2 text-sm sm:text-base focus:outline-none"
                  />
                )}
              </div>

              {/* Domain (for General Interview only) */}
              {interviewType === "General" && (
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base mb-1 font-medium">
                    Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      if (e.target.value !== "Other") setDomainOther("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none text-sm sm:text-base"
                  >
                    <option value="">Select a domain (Required)</option>
                    {domainOptions.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                  {domain === "Other" && (
                    <input
                      type="text"
                      value={domainOther}
                      onChange={(e) => setDomainOther(e.target.value)}
                      placeholder="Please specify your domain"
                      className="w-full p-2 border border-gray-300 rounded mt-2 text-sm sm:text-base focus:outline-none"
                    />
                  )}
                </div>
              )}

              {/* Interview Type Display */}
              <div>
                <label className="block text-gray-700 text-sm sm:text-base mb-1 font-medium">
                  Interview Type
                </label>
                <div className="p-2 border border-gray-300 rounded bg-gray-100 text-sm sm:text-base">
                  {interviewType}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCloseModal}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-white rounded text-sm sm:text-base
                  ${isFormValid() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isFormValid()}
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

export default PracticeTest;