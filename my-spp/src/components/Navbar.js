import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { AuthContext } from "../services/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    
    
    logout();
    
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
