// PracticeTest.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

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

  // Sample skill suggestions (modify as needed)
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

  // Domain options (modified from Knowledge Domain options)
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

    // Only validate domain if interviewType is "General"
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
      // Only include domain for General interview
      knowledgeDomain: interviewType === "General" 
        ? (domain === "Other" ? domainOther : domain) 
        : null,
      interviewType,
    };

    // You can choose to navigate to a different route based on interviewType if needed.
    navigate("/start-general-interview", { state: formData });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden">
      {/* Decorative floating gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="text-center p-8 z-10">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 drop-shadow-lg">
          Interview Practice
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* General Interview Card */}
          <div
            className="h-64 p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
            hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => {
              setInterviewType("General");
              handleOpenModal();
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/laptop.png"
              alt="General Interview"
              className="mb-4 w-14 h-14 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              General Interview
            </h2>
          </div>

          {/* Coding Interview Card */}
          <div
            className="h-64 p-8 bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl 
            hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => {
              setInterviewType("Coding Interview");
              handleOpenModal();
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/code.png"
              alt="Coding Interview"
              className="mb-4 w-14 h-14 drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Coding Interview
            </h2>
          </div>
        </div>
      </div>

      {/* Modal for Interview */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-25 cursor-pointer"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md 
                       p-6 mx-4 overflow-y-auto animate-fadeIn scale-95 
                       transition-transform duration-300 my-modal-content"
            style={{ maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
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

            {/* Experience (Required) */}
            <label className="block text-gray-700 mb-1 font-medium">
              Experience
            </label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter your experience in years"
              className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
            />

            {/* Skills (Required) */}
            <label className="block text-gray-700 mb-1 font-medium">
              Select Key Skill(s)
            </label>
            <select
              value={skills}
              onChange={(e) => {
                setSkills(e.target.value);
                if (e.target.value !== "Other") setSkillsOther("");
              }}
              className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">Select a skill (Required)</option>
              {skillSuggestions.map((skill) => (
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
                className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
              />
            )}

            {/* Domain (Required only for General Interview) */}
            {interviewType === "General" && (
              <>
                <label className="block text-gray-700 mb-1 font-medium">
                  Domain
                </label>
                <select
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    if (e.target.value !== "Other") setDomainOther("");
                  }}
                  className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
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
                    className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
                  />
                )}
              </>
            )}

            {/* Display Interview Type (non-selectable) */}
            <div className="mb-3">
              <label className="block text-gray-700 mb-1 font-medium">
                Interview Type
              </label>
              <div className="p-2 border border-gray-300 rounded bg-gray-100">
                {interviewType}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className={`px-4 py-2 text-white rounded 
                  ${isFormValid() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}
                `}
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

/* Inline custom CSS (optional demonstration) */
const customStyles = `
.my-custom-card {
  background: linear-gradient(135deg, #f8f8f8 20%, #ffe6fa 100%);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.my-custom-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
.my-modal-content {
  border: 1px solid #d4d4d4;
  border-radius: 1rem;
}
`;

export default PracticeTest;

/* For demonstration, let's inject the styles right into the page */
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = customStyles;
  document.head.appendChild(styleTag);
}
