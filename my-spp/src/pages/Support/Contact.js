import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Youtube, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Social media icons data
  const socialIcons = [
    {
      name: "Instagram",
      icon: <Instagram size={28} className="md:h-8 md:w-8" />,
      link: "https://www.instagram.com/intraintech_itt_1?igsh=c2tvdHNzYXBuNnpi",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      hoverColor: "text-pink-500"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={28} className="md:h-8 md:w-8" />,
      link: "https://www.linkedin.com/company/intraintech/",
      bgColor: "bg-blue-600",
      hoverColor: "text-blue-600"
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={28} className="md:h-8 md:w-8" />,
      link: "https://wa.me/919937012448",
      bgColor: "bg-green-500",
      hoverColor: "text-green-500"
    },
    {
      name: "Facebook",
      icon: <Facebook size={28} className="md:h-8 md:w-8" />,
      link: "https://www.facebook.com/share/1BiegdVgib/",
      bgColor: "bg-blue-700",
      hoverColor: "text-blue-700"
    },
    {
      name: "YouTube",
      icon: <Youtube size={28} className="md:h-8 md:w-8" />,
      link: "https://youtube.com/@intraintech?si=KugtGA4ljUMLomDN",
      bgColor: "bg-red-600",
      hoverColor: "text-red-600"
    },
    {
      name: "Email",
      icon: <Mail size={28} className="md:h-8 md:w-8" />,
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=ai4interview.itt@gmail.com",
      bgColor: "bg-gray-700",
      hoverColor: "text-gray-700"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const formItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-12"
    >
      
      {/* Container with max width for larger screens */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 md:space-y-12">
        
        {/* Header */}
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-md mx-auto">
            Connect with us on social media or drop us an email.
          </p>
        </motion.div>

        {/* Card with shadow for social icons */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 md:p-10 w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Social Icons with Animation */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            
            {socialIcons.map((social, index) => (
              <motion.a 
                key={index}
                href={social.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`${social.bgColor} text-white p-3 rounded-full`}
                  whileHover={{ scale: 1.15, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.div>
                <span className={`mt-2 text-xs md:text-sm text-gray-600 group-hover:${social.hoverColor}`}>
                  {social.name}
                </span>
              </motion.a>
            ))}

          </div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 md:p-10 w-full"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <motion.h2 
            className="text-2xl font-semibold text-gray-800 mb-6"
            variants={formItemVariants}
          >
            Send us a message
          </motion.h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={formItemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <motion.input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)" }}
                />
              </motion.div>
              <motion.div variants={formItemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <motion.input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)" }}
                />
              </motion.div>
            </div>
            <motion.div variants={formItemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <motion.input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)" }}
              />
            </motion.div>
            <motion.div variants={formItemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <motion.textarea 
                rows="4" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)" }}
              ></motion.textarea>
            </motion.div>
            <motion.button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
              variants={formItemVariants}
              whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
        
        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-sm md:text-base text-gray-600">© {year} IntrainTech. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}