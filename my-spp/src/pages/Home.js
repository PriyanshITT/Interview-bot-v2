import React from "react";
import "../index.css";

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold text-center text-gray-900">
        AI Efficiency + Human Expertise = Perfect Hiring!
      </h1>
      <p className="text-lg text-gray-700 mt-4 text-center">
        Try Intraintec’s Hybrid Interview Solution.
      </p>
      
      {/* Images and Sections */}
      <div className="mt-10 flex flex-wrap justify-center gap-10">
        <div className="max-w-md text-center">
          <img 
            src="https://interview.intraintech.com/wp-content/uploads/2024/08/ai-generated-8015425_1280-1-1024x1024.jpg" 
            alt="AI Interview Bot" 
            className="w-64 h-64 object-cover rounded-lg shadow-lg"
          />
          <p className="text-gray-600 mt-4">
            Want to practice seamlessly for interviews?
          </p>
          <a href="/ai-interview-test" className="text-blue-600 font-semibold">
            Try our Interview Bot
          </a>
        </div>

        <div className="max-w-md text-center">
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/online-interview-2161930-1816236.png" 
            alt="Human Interview" 
            className="w-64 h-64 object-cover rounded-lg shadow-lg"
          />
          <p className="text-gray-600 mt-4">
            Want to gain real-time experience with a person?
          </p>
          <a href="/live-interview" className="text-blue-600 font-semibold">
            Try out Human Interview
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
