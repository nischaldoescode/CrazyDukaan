import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const OrderProcessingAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    "Verifying Order",
    "Preparing Package",
    "Finalizing Details",
    "Order Confirmed!"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Adjust speed here (30ms per 1%)

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress >= 25 && currentStep === 1) setCurrentStep(2);
    else if (progress >= 50 && currentStep === 2) setCurrentStep(3);
    else if (progress >= 75 && currentStep === 3) setCurrentStep(4);
  }, [progress, currentStep]);

  return (
    <div className="fixed inset-0 bg-orange-300 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 10 }}
        className="w-full max-w-md px-6 py-8 text-center"
      >
        {/* Animated Truck */}
        <motion.div
          animate={{ 
            x: ["-50%", "50%", "-50%"],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mx-auto mb-8 w-24 h-24 relative"
        >
          <img 
            src={assets.delivery_truck} // Replace with your truck icon
            className="w-full h-full object-contain"
            alt="Delivery truck"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium"
          >
            🚚 On its way!
          </motion.div>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${currentStep > i ? 'bg-indigo-500 text-white' : 
                  currentStep === i ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-1 ${currentStep > i ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Current Step Text */}
        <motion.h2
          key={currentStep}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold mb-4 text-gray-800"
        >
          {steps[currentStep - 1]}
        </motion.h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Animated Checkmarks */}
        {currentStep > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center gap-4 mb-6"
          >
            {[...Array(currentStep - 1)].map((_, i) => (
              <div key={i} className="bg-green-100 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ))}
          </motion.div>
        )}

        {/* Percentage Counter */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-4xl font-bold text-orange-600 mb-2"
        >
          {progress}%
        </motion.div>

        {/* Help Text */}
        <p className="text-gray-500 text-sm">
          Please wait while we process your order...
        </p>
      </motion.div>
    </div>
  );
};

export default OrderProcessingAnimation;