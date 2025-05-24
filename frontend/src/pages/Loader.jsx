import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [showFinalText, setShowFinalText] = useState(false);

  useEffect(() => {
    // Much faster timings for sleek experience
    const timer1 = setTimeout(() => setShowFinalText(true), 800); // Reduced from 1500
    const timer2 = setTimeout(() => setShowLoader(false), 1400); // Reduced from 2500
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Prevent scrolling when loader is active
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showLoader]);

  const words = ["Dukaan", "in", "your", "hand"];
  const positions = [
    { x: -60, y: -30 }, // Reduced movement for sleeker feel
    { x: 60, y: -20 },
    { x: -50, y: 25 },
    { x: 45, y: 15 }
  ];

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-orange-200 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.25, ease: "easeInOut" } // Much faster exit
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center justify-center w-full max-w-xs px-4">
            {/* Animated logo container */}
            <div className="relative p-6 w-full flex justify-center">
              {/* Sleek 3D Logo Animation */}
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -10, 0], // Reduced bounce
                  rotateY: [0, 180, 360],
                  rotateX: [0, 10, 0], // Reduced rotation
                }}
                transition={{
                  duration: 1, // Faster rotation
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src="https://res.cloudinary.com/dgia0ww1z/image/upload/v1745403100/cmo495utoruwwaon5g1y.webp"
                  alt="Logo"
                  className="w-24 h-24 md:w-28 md:h-28"
                  initial={{ scale: 0, rotate: -90 }} // Reduced initial rotation
                  animate={{ 
                    scale: [0.9, 1.1, 1], // Subtle scale animation
                    rotate: 0
                  }}
                  transition={{
                    duration: 0.5, // Much faster initial animation
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
              </motion.div>
              
              {/* Sleek pulsing circles */}
              <motion.div 
                className="absolute inset-0 m-auto rounded-full border-2 border-orange-300/40"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }} // Reduced scale
                transition={{
                  duration: 0.8, // Faster pulse
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeOut",
                }}
              />
              <motion.div 
                className="absolute inset-0 m-auto rounded-full border-2 border-orange-400/25"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.7, opacity: 0 }}
                transition={{
                  duration: 1, // Faster pulse
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeOut",
                  delay: 0.1
                }}
              />
            </div>

            {/* Sleek loading text */}
            {!showFinalText ? (
              <motion.div className="w-full text-center overflow-visible">
                <motion.p 
                  className="text-lg md:text-xl font-medium text-orange-800 tracking-wider"
                >
                  {"Loading".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 0, rotateZ: 0 }}
                      animate={{ 
                        y: [0, -8, 0], // Reduced movement
                        rotateZ: [0, 5, -5, 0], // Subtle rotation
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 0.5, // Much faster
                        repeat: Infinity,
                        delay: i * 0.03, // Faster stagger
                        ease: "easeInOut"
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6, // Faster dots
                      repeatDelay: 0.05,
                      times: [0, 0.5, 1]
                    }}
                  >
                    ...
                  </motion.span>
                </motion.p>
              </motion.div>
            ) : (
              // Sleek final text animation
              <motion.div 
                className="w-full text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }} // Much faster fade in
              >
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      className="text-xl md:text-2xl font-bold text-orange-700"
                      initial={{ 
                        x: positions[index].x,
                        y: positions[index].y,
                        opacity: 0,
                        rotate: index % 2 === 0 ? -8 : 8 // Reduced rotation
                      }}
                      animate={{ 
                        x: 0,
                        y: 0,
                        opacity: 1,
                        rotate: 0
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200, // Stiffer spring for faster movement
                        damping: 15,
                        delay: index * 0.05, // Much faster stagger
                        duration: 0.2
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sleek exit animation */}
          <motion.div 
            className="absolute inset-0 bg-white z-[-1]"
            initial={{ scale: 0 }}
            animate={{ 
              scale: showFinalText ? [0, 8] : 0, // Reduced scale for smoother exit
              opacity: showFinalText ? [0, 1] : 0
            }}
            transition={{ 
              delay: showFinalText ? 0.2 : 0, // Faster delay
              duration: 0.4, // Faster exit
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
