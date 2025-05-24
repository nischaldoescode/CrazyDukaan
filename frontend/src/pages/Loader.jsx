import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [showFinalText, setShowFinalText] = useState(false);

  useEffect(() => {
    // Reduced timings for faster animation
    const timer1 = setTimeout(() => setShowFinalText(true), 1500); // was 3000
    const timer2 = setTimeout(() => setShowLoader(false), 2500); // was 4500
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const words = ["Dukaan", "in", "your", "hand"];
  const positions = [
    { x: -100, y: -50 },
    { x: 100, y: -30 },
    { x: -80, y: 40 },
    { x: 70, y: 20 }
  ];

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-[60] bg-orange-200 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.4, ease: "easeInOut" } // was 0.8
          }}
          transition={{ duration: 0.4 }} // was 0.8
        >
          <div className="flex flex-col items-center justify-center w-full max-w-xs px-4">
            {/* Animated logo container */}
            <div className="relative p-6 w-full flex justify-center">
              {/* 3D Rotating and Bouncing Logo - Faster */}
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 180, 360],
                  rotateX: [0, 20, 0],
                }}
                transition={{
                  duration: 1.5, // was 3
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src="https://res.cloudinary.com/dgia0ww1z/image/upload/v1745403100/cmo495utoruwwaon5g1y.webp"
                  alt="Logo"
                  className="w-24 h-24 md:w-28 md:h-28"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    rotate: 0
                  }}
                  transition={{
                    duration: 0.8, // was 1.3
                    ease: [0.15, 1, 0.3, 1],
                  }}
                />
              </motion.div>
              
              {/* Multiple pulsing circles - Faster */}
              <motion.div 
                className="absolute inset-0 m-auto rounded-full border-2 border-orange-300/50"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{
                  duration: 1, // was 2
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeOut",
                  delay: 0.1 // was 0.2
                }}
              />
              <motion.div 
                className="absolute inset-0 m-auto rounded-full border-2 border-orange-400/30"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 1.2, // was 2.5
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeOut",
                  delay: 0.2 // was 0.4
                }}
              />
            </div>

            {/* Animated loading text - Faster */}
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
                        y: [0, -15, 0],
                        rotateZ: [0, 10, -10, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 0.8, // was 1.5
                        repeat: Infinity,
                        delay: i * 0.05, // was 0.1
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
                      duration: 0.8, // was 1.5
                      repeatDelay: 0.1, // was 0.2
                      times: [0, 0.5, 1]
                    }}
                  >
                    ...
                  </motion.span>
                </motion.p>
              </motion.div>
            ) : (
              // Final text animation - words flying in from different directions - Faster
              <motion.div 
                className="w-full text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }} // was 0.5
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
                        rotate: index % 2 === 0 ? -15 : 15
                      }}
                      animate={{ 
                        x: 0,
                        y: 0,
                        opacity: 1,
                        rotate: 0
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 150, // was 100
                        damping: 12, // was 10
                        delay: index * 0.1, // was 0.2
                        duration: 0.3 // was 0.5
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Exit animation elements - Faster */}
          <motion.div 
            className="absolute inset-0 bg-white z-[-1]"
            initial={{ scale: 0 }}
            animate={{ 
              scale: showFinalText ? [0, 10] : 0,
              opacity: showFinalText ? [0, 1] : 0
            }}
            transition={{ 
              delay: showFinalText ? 0.3 : 0, // was 0.5
              duration: 0.6, // was 1
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
