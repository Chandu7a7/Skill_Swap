import React from 'react';

function Content() {
  return (
    <div className="h-[29rem] bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-start gap-10">
        
        {/* Left Section - Title */}
        <div className="text-white text-4xl md:text-5xl font-bold leading-tight">
          <h1>SkillSwap</h1>
          <h1>Learn & Teach</h1>
          <h1>Made Easy</h1>
        </div>

        {/* Right Section - Features */}
        <div className="flex flex-col gap-6 text-white text-lg md:text-xl font-semibold">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-black text-sm font-bold mt-1">
                ✓
              </div>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  "Exchange your skills with passionate learners.",
  "Learn from real people with real experiences.",
  "Build connections & grow your professional network.",
  "Certificates to showcase your learning & teaching.",
];

export default Content;
