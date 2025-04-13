import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../services/AuthContext';

const SpringBootUrl = process.env.REACT_APP_SPRINGBOOT_URL;

const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    const form = document.querySelector('.auth-form');
    if (form) {
      form.style.opacity = 1;
    }
  }, [isLogin]);

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setFullName('');
    setRegisterEmail('');
    setCountryCode('+91');
    setPhone('');
    setRegisterPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${SpringBootUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      login(data.token, {
        id: data.id,
        username: data.username,
        roles: data.roles,
      });

      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error:', error.message);
      setIsLoading(false);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${SpringBootUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          username: registerEmail,
          number: countryCode + phone,
          role: ['user'],
          password: registerPassword,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          setIsLoading(false);
          resetForm();
          setIsLogin(true);
        }, 1000);
      } else {
        setIsLoading(false);
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-[800px] md:min-h-[800px] bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex flex-col items-center justify-center p-4">
      {/* Catchy Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Ace Your Interviews with AI-Powered Precision
        </h1>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-full overflow-hidden ${isLogin ? 'max-w-4xl flex' : 'max-w-md'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex"
          >
            {/* Image for Login Page */}
            {isLogin && (
              <div className="hidden md:block w-1/2">
                <img
                  src="https://interview.intraintech.com/wp-content/uploads/2024/07/11-768x768.jpg"
                  alt="Login Illustration"
                  className="h-full w-full object-cover rounded-l-2xl"
                />
              </div>
            )}

            {/* Form Container */}
            <div className={`${isLogin ? 'w-full md:w-1/2 p-8' : 'w-full p-8'}`}>
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-6 text-gray-800">
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.h2>

              {message && (
                <motion.div variants={itemVariants} className="text-center text-red-500 mb-4">
                  {message}
                </motion.div>
              )}

              <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form space-y-6">
                {!isLogin && (
                  <motion.div variants={itemVariants}>
                    <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                      required
                    />
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <label className="block mb-1 font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={isLogin ? loginEmail : registerEmail}
                    onChange={(e) => isLogin ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                    required
                  />
                </motion.div>

                {!isLogin && (
                  <motion.div variants={itemVariants}>
                    <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
                    <div className="flex">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white w-24"
                        required
                      >
                        <option value="+93">+93 (Afghanistan)</option>
                        <option value="+355">+355 (Albania)</option>
                        <option value="+213">+213 (Algeria)</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (United States)</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="flex-1 p-3 rounded-r-lg border border-l-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <label className="block mb-1 font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={isLogin ? loginPassword : registerPassword}
                    onChange={(e) => isLogin ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                    required
                  />
                </motion.div>

                {!isLogin && (
                  <motion.div variants={itemVariants}>
                    <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                      required
                    />
                  </motion.div>
                )}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  {isLogin ? 'Login' : 'Register'}
                </motion.button>
              </form>

              <motion.div variants={itemVariants} className="mt-6 text-center text-gray-600">
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => {
                      resetForm();
                      setIsLogin(!isLogin);
                    }}
                    className="ml-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  >
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
