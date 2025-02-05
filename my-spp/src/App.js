import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import InterviewTest from "./pages/InterviewTest";
import "./styles/App.css";
import PracticeTest from "./pages/PracticeTest";
import Start_General_Interview from "./pages/Start_General_Interview";
import JobDescriptionBasedInterview from "./pages/JobDescriptionBasedInterview";
import JobRoleBasedInterview from "./pages/JobRoleBasedInterview";
import Training_session from "./pages/Training_session";
import ResumeBuilder from "./pages/ResumeBuilder";
import Contact from "./pages/Contact";
import InterviewSupport from "./pages/Interview_support";

import LiveInterview from "./pages/LiveInterview";
const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (

    <Router>
      
      <Navbar />
      <div className="main-layout">
        <Sidebar toggleSidebar={setIsSidebarCollapsed} />
        <div className={`content ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-interview-test" element={<InterviewTest />}/>
            <Route path="/interview-practice" element={<PracticeTest />}/>
            <Route path="/start-general-interview" element={<Start_General_Interview />}/>
            <Route path="/job-role-interview" element={<JobRoleBasedInterview />}/>
            <Route path="/job-description-interview" element={<JobDescriptionBasedInterview />}/>
            <Route path="/training-session" element={<Training_session />}/>
            <Route path="/resume-builder" element={<ResumeBuilder />}/>
            <Route path="/interview-support" element={<InterviewSupport />}/>
            
            <Route path="/contact" element={<Contact />}/>
            <Route path="/live-interview" element={<LiveInterview />}/>
            
            
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
