import React from 'react';
import { useState, useRef } from 'react';
import bootcamp from '../../assets/bootcamp.jpg';
import { motion } from 'framer-motion';

export default function TrainingSession() {
  // Navigation functions for the buttons
  const handleRegisterClick = () => {
    window.open('https://intraintech.com/enrollment/', '_blank');
  };

  const handleLearnMoreClick = () => {
    window.open('https://intraintech.com/our-services/', '_blank');
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "backOut" }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 text-black min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Header Text */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight">
            Learn New & Exciting Concepts
            <span className="block mt-2 text-blue-600">Master Fundamentals & Advanced Skills</span>
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
        </motion.div>

        {/* Sections Container */}
        <div className="space-y-16 md:space-y-24">
          
          {/* Webinars Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
            className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
          >
            
            {/* Text */}
            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">WEBINARS</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Expand Your Knowledge Through Interactive Webinars
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Join our expert-led sessions covering the latest trends and technologies in the industry.
              </p>
              <motion.a 
                href="https://webinar.intraintech.com/" 
                className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Webinars
              </motion.a>
            </div>

            {/* Image */}
            <div className="md:w-1/2 flex justify-center">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="https://i.postimg.cc/Vv6JmHbj/Screenshot-2025-01-29-151553.png"
                  alt="Webinar Portal Preview" 
                  className="relative rounded-lg shadow-lg w-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Internship Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
            className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-12"
          >
            
            {/* Text */}
            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">INTERNSHIPS</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Gain Hands-on Experience Through Real Projects
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Apply your skills in real-world scenarios and build your portfolio with our internship opportunities.
              </p>
              <motion.a 
                href="https://internship.intraintech.com/" 
                className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Internships
              </motion.a>
            </div>

            {/* Image */}
            <div className="md:w-1/2 flex justify-center">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="https://i.postimg.cc/YqvvPZ77/Screenshot-2025-01-29-151755.png" 
                  alt="Internship Portal Preview" 
                  className="relative rounded-lg shadow-lg w-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Additional Section: Workshops */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
            className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
          >
            
            {/* Text */}
            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">WORKSHOPS</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Intensive Skill-Building Workshops
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Participate in our focused workshops designed to master specific technologies and techniques.
              </p>
              <motion.a 
                href="https://chat.whatsapp.com/ILBJH84DRLyJrxDf8MgPMg" 
                className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Click to Schedule
              </motion.a>
            </div>

            {/* Image */}
            <div className="md:w-1/2 flex justify-center">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src={bootcamp}
                  alt="Workshop Session" 
                  className="relative rounded-lg shadow-lg w-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Call to Action */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
          className="mt-16 md:mt-24 text-center p-8 bg-gray-800 rounded-xl shadow-lg"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Ready to accelerate your career?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Join thousands of students who have transformed their careers through our training programs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button 
              onClick={handleRegisterClick}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </motion.button>
            <motion.button 
              onClick={handleLearnMoreClick}
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg shadow-md hover:bg-white hover:text-gray-800 transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}