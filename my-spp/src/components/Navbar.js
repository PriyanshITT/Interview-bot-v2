// Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { AuthContext } from "../services/AuthContext";
import { FaBars, FaHome, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <button className="hamburger-button" onClick={toggleMobileSidebar}>
        <FaBars />
      </button>
      <h1>INTERVIEW BOT</h1>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <span className="link-text">Home</span>
          <FaHome className="link-icon" />
        </Link>
        <button onClick={handleLogout} className="logout-button">
          <span className="link-text">Logout</span>
          <FaSignOutAlt className="link-icon" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;