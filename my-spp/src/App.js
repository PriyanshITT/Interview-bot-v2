import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import InterviewTest from "./pages/InterviewTest";
import Sentiment from "./pages/Sentiment";
import "./styles/App.css";
import PracticeTest from "./pages/PracticeTest";
import Start_General_Interview from "./pages/Start_General_Interview";
import JobDescriptionBasedInterview from "./pages/JobDescriptionBasedInterview";
import JobRoleBasedInterview from "./pages/JobRoleBasedInterview";
import Training_session from "./pages/Training_session";

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
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/ai-interview-test" element={<InterviewTest />}/>
            <Route path="/interview-practice" element={<PracticeTest />}/>
            <Route path="/start-general-interview" element={<Start_General_Interview />}/>
            <Route path="/job-role-interview" element={<JobRoleBasedInterview />}/>
            <Route path="/job-description-interview" element={<JobDescriptionBasedInterview />}/>
            <Route path="/training-session" element={<Training_session />}/>
            
            
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
