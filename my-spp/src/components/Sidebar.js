import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaUserTie, FaChartBar, 
  FaChevronLeft, FaChevronRight, FaFileAlt, FaCommentDots, 
  FaPhone, FaUsers 
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get current route path

  const handleToggle = () => {
    setCollapsed(!collapsed);
    toggleSidebar(!collapsed); // Notify parent (App.js) about state change
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={handleToggle}>
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <h2 className="sidebar-title">{collapsed ? "ITT" : "AInterviewers"}</h2>

      <ul>
        <li className={location.pathname === "/" ? "active-btn" : ""}>
          <Link to="/">
            <FaHome className="icon" />
            <span className={collapsed ? "hidden" : ""}>Home</span>
          </Link>
        </li>

        <p className="section-title">Interview</p>
        <li className={location.pathname === "/interview-practice" ? "active-btn" : ""}>
          <Link to="/interview-practice">
            <FaFileAlt className="icon" />
            <span className={collapsed ? "hidden" : ""}>Interview Practice</span>
          </Link>
        </li>
        <li className={location.pathname === "/ai-interview-test" ? "active-btn" : ""}>
          <Link to="/ai-interview-test">
            <FaClipboardList className="icon" />
            <span className={collapsed ? "hidden" : ""}>AI Interview Test</span>
          </Link>
        </li>
        
        <li className={location.pathname === "/live-interview" ? "active-btn" : ""}>
          <Link to="/live-interview">
            <FaUserTie className="icon" />
            <span className={collapsed ? "hidden" : ""}>Live Interview</span>
          </Link>
        </li>
        <li className={location.pathname === "/results" ? "active-btn" : ""}>
          <Link to="/results">
            <FaChartBar className="icon" />
            <span className={collapsed ? "hidden" : ""}>Results</span>
          </Link>
        </li>

        <p className="section-title">Tools</p>
        <li className={location.pathname === "/resume-builder" ? "active-btn" : ""}>
          <Link to="/resume-builder">
            <FaFileAlt className="icon" />
            <span className={collapsed ? "hidden" : ""}>ATS Score</span>
          </Link>
        </li>
        <li className={location.pathname === "/recruiter-chat" ? "active-btn" : ""}>
          <Link to="/recruiter-chat">
            <FaCommentDots className="icon" />
            <span className={collapsed ? "hidden" : ""}>Recruiter Chat</span>
          </Link>
        </li>

        <p className="section-title">Support</p>
        <li className={location.pathname === "/interview-support" ? "active-btn" : ""}>
          <Link to="/interview-support">
            <FaUsers className="icon" />
            <span className={collapsed ? "hidden" : ""}>Interview Support</span>
          </Link>
        </li>
        <li className={location.pathname === "/training-session" ? "active-btn" : ""}>
          <Link to="/training-session">
            <FaClipboardList className="icon" />
            <span className={collapsed ? "hidden" : ""}>Training Session</span>
          </Link>
        </li>
        <li className={location.pathname === "/contact" ? "active-btn" : ""}>
          <Link to="/contact">
            <FaPhone className="icon" />
            <span className={collapsed ? "hidden" : ""}>Contact Us</span>
          </Link>
        </li>
      </ul>

      <div className="footer-logo">
        <img 
          src="https://i.postimg.cc/7Y0zKjDR/ITT-logo.jpg" 
          alt="Intrain Tech Logo" 
          className="opacity-30 w-32"
        />
      </div>

    </div>
  );
};

export default Sidebar;
