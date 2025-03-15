import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const url = process.env.REACT_APP_TEST_URL;
const ResumeBuilder = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription) {
      toast.error("Please upload a resume and provide a job description");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(`${url}/ats_score`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAtsScore(response.data.ats_score);
      setSessionId(response.data.session_id);
      setShowSuggestions(false);
      setImprovementSuggestions([]);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error calculating ATS score");
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!sessionId) {
      toast.error("No session ID available. Please calculate ATS score first.");
      return;
    }

    setRecLoading(true);
    try {
      const response = await axios.post(
        `${url}/get_recommendations`,
        { session_id: sessionId },
        { headers: { "Content-Type": "application/json" } }
      );

      setImprovementSuggestions(response.data.improvement_suggestions || []);
      setShowSuggestions(!showSuggestions);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching recommendations");
    } finally {
      setRecLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const loadingVariants = {
    animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: "linear" } },
  };

  const scoreVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const suggestionsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex flex-col items-center px-4 py-6 sm:py-8 md:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center"
        variants={titleVariants}
      >
        Resume ATS Score Calculator
      </motion.h1>

      <motion.div
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl"
        variants={cardVariants}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <motion.div variants={inputVariants} className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-2 text-sm sm:text-base">
              Upload Resume (PDF only)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="border rounded-md py-2 px-3 text-gray-500 text-sm sm:text-base w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={inputVariants} className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-2 text-sm sm:text-base">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="border rounded-md py-2 px-3 text-gray-500 text-sm sm:text-base h-32 sm:h-40 resize-none w-full"
              disabled={loading}
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`bg-purple-400 text-white px-6 py-2 rounded-md w-full sm:w-auto mx-auto ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-500"
            }`}
            variants={buttonVariants}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  variants={loadingVariants}
                  animate="animate"
                />
                Calculating...
              </div>
            ) : (
              "Get ATS Score"
            )}
          </motion.button>
        </form>

        {atsScore !== null && (
          <motion.div
            className="mt-6 text-center flex flex-col items-center gap-4"
            variants={scoreVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
              Your ATS Score: <span className="text-purple-400">{atsScore}/100</span>
            </h2>

            <motion.button
              onClick={handleGetRecommendations}
              disabled={recLoading}
              className={`bg-blue-500 text-white px-6 py-2 rounded-md w-full sm:w-auto ${
                recLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              variants={buttonVariants}
              whileHover={{ scale: recLoading ? 1 : 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {recLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    variants={loadingVariants}
                    animate="animate"
                  />
                  Loading...
                </div>
              ) : showSuggestions ? (
                "Hide Recommendations"
              ) : (
                "Get Recommendations"
              )}
            </motion.button>

            <motion.div
              className="mt-4 w-full text-left"
              variants={suggestionsVariants}
              initial="hidden"
              animate={showSuggestions ? "visible" : "hidden"}
            >
              {improvementSuggestions.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-600 text-sm sm:text-base">
                  {improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="mb-2">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : showSuggestions ? (
                <p className="text-gray-500 text-sm sm:text-base">
                  No improvement suggestions available.
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full"
              variants={loadingVariants}
              animate="animate"
            />
          </motion.div>
        )}
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-4"
      />
    </motion.div>
  );
};

export default ResumeBuilder;