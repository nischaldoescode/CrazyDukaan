import React from "react";

const InstagramButton = () => {
  const instagramProfileUrl = "https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDgxNTY4NTYxNjc1Njcx?story_media_id=3614768172588422124_54426071838&igsh=NzBycmI2bGg4OG85";

  return (
    <div className="flex justify-center space-x-4 items-center mb-2 bg-slate-100 py-3 border-stone-300 border-t-2 border-b-2 text-center">
      {/* Text link with hover effect */}
      <a
        href={instagramProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-pink-600 transition-colors duration-300"
      >
        <p className="text-gray-700 hover:text-pink-600 transition-colors duration-300">
          Customer Reviews, Feedback via Instagram
        </p>
      </a>
      
      {/* Instagram button with hover and pulse effects */}
      <a
        href={instagramProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-button hover:scale-105 transition-transform duration-300"
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          color: "white",
          padding: "7px 7px",
          borderRadius: "8px",
          textDecoration: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          animation: "pulse 2s infinite",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
          alt="Instagram"
          style={{ 
            width: "20px", 
            margin: "0 auto",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))"
          }}
        />
      </a>
      
      {/* Global styles for pulse animation - added in your main CSS file or via styled-components */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(216, 36, 159, 0.4);
            }
            70% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(216, 36, 159, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(216, 36, 159, 0);
            }
          }
          .instagram-button {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default InstagramButton;
