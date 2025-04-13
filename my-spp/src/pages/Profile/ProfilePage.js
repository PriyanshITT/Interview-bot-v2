// ProfilePage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { makeAuthenticatedRequest } from "../../services/auth.service";
import DataFetcher from "./DataFetcher";
import '../../styles/ProfilePage.css';

const ProfilePage = ({ isSidebarCollapsed }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [totalPossibleMarks, setTotalPossibleMarks] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).id;
                const response = await makeAuthenticatedRequest(
                    `/api/profile/get/id/${userId}`
                );
                
                // Fetch total questions attempted to calculate maximum possible marks
                const questionResponse = await makeAuthenticatedRequest(
                    `/api/question-answers/get-sorted/${userId}`
                );
                const totalQuestions = questionResponse.length;
                setTotalPossibleMarks(totalQuestions * 10);
                
                setProfile(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <motion.div
            className={`profile-container ${isSidebarCollapsed ? "expanded" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            {loading ? (
                <div className="loading-container">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    <p className="text-xl font-semibold text-white mt-4">
                        Loading profile...
                    </p>
                </div>
            ) : (
                <div className="profile-content">
                    <motion.div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-info">
                                <FaUserCircle className="profile-icon" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                                    <h3 className="text-lg text-gray-600">{profile?.username}</h3>
                                </div>
                            </div>
                            <div className="profile-actions">
                                <motion.button 
                                    className="btn change-password"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Change Password
                                </motion.button>
                                <motion.button 
                                    className="btn change-email"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Change Email
                                </motion.button>
                            </div>
                        </div>
                        <div className="profile-details">
                            <h3 className="text-xl font-semibold">
                                Total Marks Obtained: 
                                <span className="ml-2 text-blue-500">{`${profile?.totalMarks}/${totalPossibleMarks}`}</span>
                            </h3>
                        </div>
                        <div className="test-summary">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Test Summary</h2>
                            <DataFetcher />
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ProfilePage;