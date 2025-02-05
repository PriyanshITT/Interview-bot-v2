import React from 'react';

export default function TrainingSession() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center p-8 space-y-10">
      
      {/* Header Text */}
      <h1 className="text-3xl md:text-4xl font-semibold text-center">
        To learn new and exciting concepts and clear your fundamentals as well as gain advanced skills.
      </h1>

      {/* Webinars Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl space-y-6 md:space-y-0">
        
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">
            Visit our{' '}
            <a 
              href="https://webinar.intraintech.com/" 
              className="text-blue-600 font-bold hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Webinar portal
            </a>{' '}
            to check out our new and exciting Webinars.
          </h2>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://i.postimg.cc/Vv6JmHbj/Screenshot-2025-01-29-151553.png" 
            alt="Webinar Portal" 
            className="w-96 h-56 rounded-lg shadow-lg p-3"
          />
        </div>
      </div>

      {/* Internship Section */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full max-w-6xl space-y-6 md:space-y-0">
        
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">
            Want Internships and new exciting projects? Visit our{' '}
            <a 
              href="https://internship.intraintech.com/" 
              className="text-blue-600 font-bold hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Internship portal
            </a>.
          </h2>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://i.postimg.cc/YqvvPZ77/Screenshot-2025-01-29-151755.png" 
            alt="Internship Portal" 
            className="w-96 h-56 rounded-lg shadow-lg p-3"
          />
        </div>
      </div>

    </div>
  );
}
