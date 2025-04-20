import React from 'react';

const PromotionalBanner = () => {
  return (
    <div className="overflow-hidden mb-4">
      {/* Promotional Banner Container */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg overflow-hidden text-center">
        {/* Marquee container - works across all screen sizes */}
        <div className="overflow-hidden relative h-12 flex items-center">
          {/* Single text element with marquee effect */}
          <div 
            className="whitespace-nowrap absolute w-full"
            style={{
              left: "100%",
              animation: "marquee 15s linear infinite"
            }}
          >
            <span className="inline-block text-white text-lg md:text-xl font-bold">
              🎉 New user? Use code <span className="bg-white text-blue-600 px-2 py-1 rounded-md mx-1 md:mx-2">VISHNU</span> to get special discount! 🎉
            </span>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              animation: "shine 3s ease-in-out infinite"
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { left: 100%; }
          100% { left: -100%; }
        }
        @keyframes shine {
          100% { left: 150%; }
        }
      `}</style>
    </div>
  );
};

export default PromotionalBanner;