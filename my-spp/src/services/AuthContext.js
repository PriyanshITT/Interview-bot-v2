// AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return token ? { token, user } : null;
  });

  let logoutTimer = null;

  const startLogoutTimer = () => {
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const twentyMinutes = 30 * 60 * 1000; // 20 minutes in milliseconds

    // If there's a login time, calculate remaining time
    let timeRemaining = twentyMinutes;
    if (loginTime) {
      const elapsed = currentTime - parseInt(loginTime, 10);
      timeRemaining = twentyMinutes - elapsed;
      if (timeRemaining <= 0) {
        // If time is already up, logout immediately
        logout();
        return;
      }
    }

    // Set new login time if not already set
    if (!loginTime) {
      localStorage.setItem('loginTime', currentTime.toString());
    }

    // Start the timer for the remaining time
    logoutTimer = setTimeout(() => {
      logout();
    }, timeRemaining);
  };

  const clearLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }
  };

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
    startLogoutTimer();
  };

  const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setAuth(null);
  };

  // Check token expiration on mount and page refresh
  useEffect(() => {
    if (auth) {
      startLogoutTimer();
    }

    // Cleanup timer on unmount
    return () => clearLogoutTimer();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};