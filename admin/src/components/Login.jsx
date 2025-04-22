import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      
      if (response.data.success) {
        toast.success('Login successful!');
        setToken(response.data.token);
      } else {
        setShake(true);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setShake(true);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.97 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div 
        className="bg-white shadow-lg rounded-xl px-6 py-8 max-w-md w-full border border-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <motion.div 
          className="text-center mb-6"
          variants={itemVariants}
        >
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
            <FaShieldAlt className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 mt-2">Please login to continue</p>
        </motion.div>

        <motion.form 
          onSubmit={onSubmitHandler}
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="mb-4" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input 
                id="email"
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                className="rounded-lg w-full pl-10 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none" 
                type="email" 
                placeholder="admin@example.com" 
                required 
              />
            </div>
          </motion.div>

          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input 
                id="password"
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                className="rounded-lg w-full pl-10 pr-10 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500 hover:text-gray-700 transition-colors" />
                ) : (
                  <FaEye className="text-gray-500 hover:text-gray-700 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.button 
            className={`mt-2 w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-300`}
            type="submit"
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
                <span>Login to Dashboard</span>
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div 
          className="mt-6 text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          Secure admin access only
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
