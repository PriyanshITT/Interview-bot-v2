import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Youtube, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-12 space-y-12">
      
      {/* Header */}
      <h1 className="text-5xl font-bold text-gray-900">Get in Touch</h1>
      <p className="text-2xl text-gray-700 text-center max-w-lg">
        Connect with us on social media or drop us an email.
      </p>

      {/* Social Icons */}
      <div className="flex gap-8">
        
        {/* Instagram */}
        <a 
          href="https://www.instagram.com/intraintech_itt_1?igsh=c2tvdHNzYXBuNnpi" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-pink-500 hover:text-pink-700 transition duration-300"
        >
          <Instagram size={50} />
        </a>

        {/* LinkedIn */}
        <a 
          href="https://www.linkedin.com/company/intraintech/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 transition duration-300"
        >
          <Linkedin size={50} />
        </a>

        {/* WhatsApp */}
        <a 
          href="https://wa.me/919937012448" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-green-500 hover:text-green-700 transition duration-300"
        >
          <MessageCircle size={50} />
        </a>

        {/* Facebook */}
        <a 
          href="https://www.facebook.com/share/1BiegdVgib/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-700 hover:text-blue-900 transition duration-300"
        >
          <Facebook size={50} />
        </a>

        {/* YouTube */}
        <a 
          href="https://youtube.com/@intraintech?si=KugtGA4ljUMLomDN" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-600 hover:text-red-800 transition duration-300"
        >
          <Youtube size={50} />
        </a>

        {/* Email */}
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=ai4interview.itt@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-700 hover:text-gray-900 transition duration-300"
        >
          <Mail size={50} />
        </a>

      </div>    
    </div>
  );
}
