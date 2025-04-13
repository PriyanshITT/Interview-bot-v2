import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import InterviewTest from "./pages/Interview/InterviewTest";
import PracticeTest from "./pages/Interview/PracticeTest";
import Start_General_Interview from "./pages/Interview/Start_General_Interview";
import JobDescriptionBasedInterview from "./pages/Interview/JobDescriptionBasedInterview";
import JobRoleBasedInterview from "./pages/Interview/JobRoleBasedInterview";
import Training_session from "./pages/Support/Training_session";
import ResumeBuilder from "./pages/Tools/ResumeBuilder";
import Contact from "./pages/Support/Contact";
import InterviewSupport from "./pages/Support/Interview_support";
import RecruiterChat from "./pages/Tools/RecruiterChat";
import LiveInterview from "./pages/Interview/LiveInterview";
import AiRecruiter_chat from "./pages/Tools/AiRecruiter_chat";
import TutorForm from "./form/TutorForm";
import TutorList from "./form/TutorList";
import SpeechToText from "./components/Speechtotext";
import PracticeCodingInterview from "./pages/Interview/PracticeCodingInterview";
import PrivateRoute from "./services/PrivateRoute";
import ProfilePage from "./pages/Profile/ProfilePage";
import AuthPage from "./components/AuthPage.js";
import "./styles/App.css";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Initialize sidebar state: collapsed for PC/tablet (>768px), collapsed for mobile
    return window.innerWidth > 768;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle resize and maintain sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarCollapsed(true); // Always collapsed on mobile
        setIsMobileOpen(false); // Close mobile menu
      } else {
        setIsSidebarCollapsed(true); // Collapsed by default on PC/tablet after login
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleSidebar = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Navbar toggleMobileSidebar={toggleMobileSidebar} />
              <div className="main-layout">
                <Sidebar
                  toggleSidebar={toggleSidebar}
                  isMobileOpen={isMobileOpen}
                  setIsMobileOpen={setIsMobileOpen}
                  isCollapsed={isSidebarCollapsed}
                />
                <div className={`content ${isSidebarCollapsed ? "collapsed" : ""}`}>
                  <Routes>
                    <Route path="/results" element={<ProfilePage />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/ai-interview-test" element={<InterviewTest />} />
                    <Route path="/interview-practice" element={<PracticeTest />} />
                    <Route path="/start-general-interview" element={<Start_General_Interview />} />
                    <Route path="/job-role-interview" element={<JobRoleBasedInterview />} />
                    <Route path="/job-description-interview" element={<JobDescriptionBasedInterview />} />
                    <Route path="/training-session" element={<Training_session />} />
                    <Route path="/resume-builder" element={<ResumeBuilder />} />
                    <Route path="/interview-support" element={<InterviewSupport />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/live-interview" element={<LiveInterview />} />
                    <Route path="/recruiter-chat" element={<RecruiterChat />} />
                    <Route path="/ai-recruiter" element={<AiRecruiter_chat />} />
                    <Route path="/tutor-form" element={<TutorForm />} />
                    <Route path="/tutor-list" element={<TutorList />} />
                    <Route path="/mic-on" element={<SpeechToText />} />
                    <Route path="/start-coding-interview" element={<PracticeCodingInterview />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;