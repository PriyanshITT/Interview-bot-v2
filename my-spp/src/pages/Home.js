import React from "react";
import "../index.css";

const Home = () => {
  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16">
      {/* Hero Section */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center text-gray-900 leading-tight max-w-4xl px-2 sm:px-4">
        AI Efficiency + Human Expertise = Perfect Hiring!
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-center max-w-2xl px-2 sm:px-4">
        Try Intraintech’s Hybrid Interview Solution.
      </p>
      
      {/* Images and Sections */}
      <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 w-full max-w-6xl flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        {/* AI Interview Section */}
        <div className="w-full sm:w-1/2 max-w-md flex flex-col items-center text-center px-2 sm:px-0">
          <img 
            src="https://interview.intraintech.com/wp-content/uploads/2024/08/ai-generated-8015425_1280-1-1024x1024.jpg" 
            alt="AI Interview Bot" 
            className="w-full max-w-[12rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[18rem] xl:max-w-[20rem] h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mt-3 md:mt-4 lg:mt-5">
            Want to practice seamlessly for interviews?
          </p>
          <a 
            href="/ai-interview-test" 
            className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl hover:underline mt-1 md:mt-2 lg:mt-3 transition-colors duration-200 hover:text-blue-800"
          >
            Try our Interview Bot
          </a>
        </div>

        {/* Human Interview Section */}
        <div className="w-full sm:w-1/2 max-w-md flex flex-col items-center text-center px-2 sm:px-0">
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/online-interview-2161930-1816236.png" 
            alt="Human Interview" 
            className="w-full md:mb-24 mb-0 max-w-[12rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[18rem] xl:max-w-[20rem] h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
          <p className="text-xs  sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600  md:mt-4 lg:mt-5">
            Want to gain real-time experience with a person?
          </p>
          <a 
            href="/live-interview" 
            className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl hover:underline mt-1 md:mt-2 lg:mt-3 transition-colors duration-200 hover:text-blue-800"
          >
            Try out Human Interview
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;