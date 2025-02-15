import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the authentication flag from localStorage
    localStorage.removeItem("isAuthenticated");
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Interview Bot</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
