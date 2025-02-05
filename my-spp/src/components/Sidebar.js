import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaUserTie, FaChartBar, 
  FaChevronLeft, FaChevronRight, FaFileAlt, FaCommentDots, 
  FaPhone, FaUsers 
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
    toggleSidebar(!collapsed); // Notify parent (App.js) about state change
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={handleToggle}>
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <h2 className={`sidebar-title ${collapsed ? "hidden" : ""}`}>
        IntrainTech’s <br /> Interview Buddy
      </h2>

      <ul>
        <li>
          <Link to="/">
            <FaHome className="icon" />
            <span className={collapsed ? "hidden" : ""}>Home</span>
          </Link>
        </li>

        <p className={`section-title ${collapsed ? "hidden" : ""}`}>Interview</p>
        <li>
          <Link to="/interview-practice">
            <FaFileAlt className="icon" />
            <span className={collapsed ? "hidden" : ""}>Interview Practice</span>
          </Link>
        </li>
        <li>
          <Link to="/ai-interview-test">
            <FaClipboardList className="icon" />
            <span className={collapsed ? "hidden" : ""}>AI Interview Test</span>
          </Link>
        </li>
        
        <li>
          <Link to="/live-interview">
            <FaUserTie className="icon" />
            <span className={collapsed ? "hidden" : ""}>Live Interview</span>
          </Link>
        </li>
        <li>
          <Link to="/results">
            <FaChartBar className="icon" />
            <span className={collapsed ? "hidden" : ""}>Results</span>
          </Link>
        </li>

        <p className={`section-title ${collapsed ? "hidden" : ""}`}>Tools</p>
        <li>
          <Link to="/resume-builder">
            <FaFileAlt className="icon" />
            <span className={collapsed ? "hidden" : ""}>Resume Builder</span>
          </Link>
        </li>
        <li>
          <Link to="/ai-recruiter-chat">
            <FaCommentDots className="icon" />
            <span className={collapsed ? "hidden" : ""}>AI Recruiter Chat</span>
          </Link>
        </li>

        <p className={`section-title ${collapsed ? "hidden" : ""}`}>Support</p>
        <li>
          <Link to="/interview-support">
            <FaUsers className="icon" />
            <span className={collapsed ? "hidden" : ""}>Interview Support</span>
          </Link>
        </li>
        <li>
          <Link to="/training-session">
            <FaClipboardList className="icon" />
            <span className={collapsed ? "hidden" : ""}>Training Session</span>
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <FaPhone className="icon" />
            <span className={collapsed ? "hidden" : ""}>Contact Us</span>
          </Link>
        </li>
      </ul>

      <div className={`footer-logo ${collapsed ? "hidden" : ""}`}>
        <img src="/path-to-logo.png" alt="Intrain Tech Logo" />
      </div>
    </div>
  );
};

export default Sidebar;
