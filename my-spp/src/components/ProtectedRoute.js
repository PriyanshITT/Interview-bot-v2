// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // For simplicity, we use localStorage.
  // In a real app you might use context or a global state.
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
