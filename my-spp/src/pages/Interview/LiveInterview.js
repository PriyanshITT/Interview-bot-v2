// LiveInterview.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primeicons/primeicons.css";

const LiveInterview = () => {
  const [tutors, setTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    axios
      .get("https://interviewbot.intraintech.com/api/api/tutors")
      .then((response) => setTutors(response.data))
      .catch((error) => console.error("Error fetching tutors:", error));
  }, []);

  // Optimized Search, Sort, and Filter Logic
  const filteredTutors = useMemo(() => {
    return tutors
      .filter((tutor) => {
        return (
          (filterLanguage === "" || tutor.languages.includes(filterLanguage)) &&
          (searchQuery === "" ||
            tutor.skills.some((skill) =>
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price") return parseFloat(a.price) - parseFloat(b.price);
        return 0;
      });
  }, [tutors, searchQuery, sortBy, filterLanguage]);

  const handleScheduleClick = (tutor) => {
    setSelectedTutor(tutor);
    setShowCalendar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    setShowCalendar(false);
    toast.success("Interview scheduled successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col items-center py-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Live Interview Tutors
        </h1>

        {/* Filter, Sort, and Search */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 w-full max-w-4xl">
          <select
            className="border text-gray-500 rounded-md py-2 px-3 w-full sm:w-auto"
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
          >
            <option value="">Filter by Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
          <select
            className="border text-gray-500 rounded-md py-2 px-3 w-full sm:w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <input
            className="border rounded-md pl-4 pr-4 py-2 w-full"
            type="text"
            placeholder="Search Skills"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tutor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredTutors.map((tutor) => (
            <motion.div
              key={tutor.id}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={`data:image/png;base64,${tutor.profilePic}`}
                  alt={tutor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mb-3"
                />
                <p className="flex items-center text-yellow-500 text-base sm:text-lg">
                  <i className="pi pi-star-fill"></i> {tutor.rating}
                </p>
              </div>
              <div className="flex flex-col justify-between w-full">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center sm:text-left">
                  {tutor.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  <strong>Languages:</strong> {tutor.languages.join(", ")}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  <strong>Skills:</strong> {tutor.skills.join(", ")}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  <strong>Experience:</strong> {tutor.experience}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  <strong>Price:</strong> {tutor.price}
                </p>
                <div className="flex gap-4 mt-4 justify-center sm:justify-start">
                  <motion.button
                    className="bg-blue-400 text-white px-5 py-1.5 rounded-md text-sm sm:text-base"
                    whileHover={{ scale: 1.1, opacity: 0.9 }}
                  >
                    Chat
                  </motion.button>
                  <motion.button
                    className="bg-purple-400 text-white px-5 py-1.5 rounded-md text-sm sm:text-base"
                    whileHover={{ scale: 1.1, opacity: 0.9 }}
                    onClick={() => handleScheduleClick(tutor)}
                  >
                    Schedule
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calendar Popup */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
                  Schedule Interview with {selectedTutor?.name}
                </h2>
                <DatePicker
                  className="w-full px-4 py-2 border rounded-md"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                />
                <button
                  className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 mt-4 rounded-md w-full"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer />
        <p className="query-text mt-9 text-center text-gray-700 text-sm sm:text-base">
          For any queries, go to the{" "}
          <a href="/contact-us" className="contact-link text-purple-600 hover:underline">
            Contact Us
          </a>{" "}
          page.
        </p>
        <div className="flex justify-center space-x-2 mt-6">
          <span className="text-gray-700 px-3 py-1 bg-white rounded-md text-sm sm:text-base">
            1
          </span>
          <span className="text-gray-700 px-3 py-1 bg-white rounded-md text-sm sm:text-base">
            2
          </span>
          <span className="text-gray-700 px-3 py-1 bg-white rounded-md text-sm sm:text-base">
            3
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveInterview;