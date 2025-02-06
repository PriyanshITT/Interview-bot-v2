import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/LiveInterview.css";
import "primeicons/primeicons.css";
import data from "../../files/tutorsData.json";

const LiveInterview = () => {
  const tutorsData = data;
  const [tutors, setTutors] = useState(tutorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredTutors = tutorsData.filter((tutor) =>
      tutor.skills.some((skill) =>
        skill.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setTutors(filteredTutors);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    const sortedTutors = [...tutors].sort((a, b) => {
      if (e.target.value === "name") {
        return a.name.localeCompare(b.name);
      } else if (e.target.value === "price") {
        return a.price.localeCompare(b.price);
      }
      return 0;
    });
    setTutors(sortedTutors);
  };

  const handleFilter = (e) => {
    setFilterLanguage(e.target.value);
    const filteredTutors = tutorsData.filter((tutor) =>
      tutor.languages.includes(e.target.value)
    );
    setTutors(filteredTutors);
  };

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
      progress: undefined,
    });
  };

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col items-center py-12">
        <motion.h1
          className="text-4xl font-bold text-white mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Live Interview Tutors
        </motion.h1>

        <motion.div
          className="flex flex-row justify-center gap-4 mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <select
            className="border text-gray-500 rounded-md py-2 px-3"
            value={filterLanguage}
            onChange={handleFilter}
          >
            <option value="">Filter by Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Portuguese">Portuguese</option>
          </select>

          <select
            className="border text-gray-500 rounded-md py-2 px-3"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>

          <input
            className="border rounded-md pl-4 pr-10 py-2 w-full"
            type="text"
            placeholder="Search Skills"
            value={searchQuery}
            onChange={handleSearch}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 w-[90%]">
          {tutors.map((tutor) => (
            <motion.div
              key={tutor.id}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-row items-center space-x-6 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: tutor.id * 0.1 }}
            > 
              <div className="flex flex-col items-center">
                <img
                  src={tutor.profilePic}
                  alt={tutor.name}
                  className="w-28 h-28 rounded-full object-cover mb-3"
                />
                <p className="flex items-center text-yellow-500 text-lg">
                  <i className="pi pi-star-fill"></i> {tutor.rating}
                </p>
              </div>

              <div className="flex flex-col justify-between">
                <h2 className="text-xl font-semibold mb-1">{tutor.name}</h2>
                <p className="text-gray-600">
                  <strong>Languages:</strong> {tutor.languages.join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Skills:</strong> {tutor.skills.join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Experience:</strong> {tutor.experience}
                </p>
                <p className="text-gray-600">
                  <strong>Price:</strong> {tutor.price}
                </p>

                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-blue-500 text-white px-7 py-1.5 rounded-md hover:bg-blue-600 transition"
                  >
                    Chat
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition"
                    onClick={() => handleScheduleClick(tutor)}
                  >
                    Schedule
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {showCalendar && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Schedule Interview with {selectedTutor?.name}
              </h2>
              <DatePicker selected={selectedDate} onChange={handleDateChange} inline />
              <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </motion.div>
        )}

        <ToastContainer />
        <p className="query-text">
          For any queries, go to the{" "}
          <a href="/contact-us" className="contact-link">
            Contact Us
          </a>{" "}
          page.
        </p>

        <div className="flex justify-center space-x-2 mt-6">
          <span className="text-gray-700 px-3 py-1 bg-white rounded-md">1</span>
          <span className="text-gray-700 px-3 py-1 bg-white rounded-md">2</span>
          <span className="text-gray-700 px-3 py-1 bg-white rounded-md">3</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveInterview;
