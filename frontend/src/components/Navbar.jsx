import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    // Cleanup: when component unmounts or sidebar is closed
    return () => {
      document.body.style.overflow = "auto"; // Restore scrolling
    };
  }, [visible]);

  return (
    <div className="flex items-center justify-between py-4 px-4 sm:py-6 sm:px-11 font-medium shadow-lg mb-3">
      <Link to="/">
        <motion.img
          src="https://res.cloudinary.com/dgia0ww1z/image/upload/v1745403186/vxulbditfalnw6v0qlpf.webp"
          className="w-[9rem] sm:w-[10.7rem] md:[10rem] lg:w-[12rem]"
          whileHover={{
            rotateY: 360, // Rotates around the Y-axis (3D flip)
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }} // Enables 3D transformations
          alt="Logo"
        />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700 md:gap-4">
        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 group relative"
        >
          <p className="group-hover:text-indigo-600 transition-colors duration-300">
            HOME
          </p>
          <div className="relative w-full h-1">
            <hr className="absolute w-0 h-[2px] bg-indigo-600 bottom-0 left-1/2 -translate-x-1/2 group-hover:w-full transition-all duration-300 origin-center" />
          </div>
        </NavLink>

        <NavLink
          to="/collection"
          className="flex flex-col items-center gap-1 group relative"
        >
          <p className="group-hover:text-indigo-600 transition-colors duration-300">
            COLLECTION
          </p>
          <div className="relative w-full h-1">
            <hr className="absolute w-0 h-[2px] bg-indigo-600 bottom-0 left-1/2 -translate-x-1/2 group-hover:w-full transition-all duration-300 origin-center" />
          </div>
        </NavLink>

        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1 group relative"
        >
          <p className="group-hover:text-indigo-600 transition-colors duration-300">
            ABOUT
          </p>
          <div className="relative w-full h-1">
            <hr className="absolute w-0 h-[2px] bg-indigo-600 bottom-0 left-1/2 -translate-x-1/2 group-hover:w-full transition-all duration-300 origin-center" />
          </div>
        </NavLink>

        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1 group relative"
        >
          <p className="group-hover:text-indigo-600 transition-colors duration-300">
            CONTACT
          </p>
          <div className="relative w-full h-1">
            <hr className="absolute w-0 h-[2px] bg-indigo-600 bottom-0 left-1/2 -translate-x-1/2 group-hover:w-full transition-all duration-300 origin-center" />
          </div>
        </NavLink>
      </ul>

      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
        />

        <div className="group relative">
          <img
            onClick={() => !token && navigate("/login")}
            className="w-5 h-auto cursor-pointer object-cover hover:scale-105 transition-all"
            src={token ? assets.user_image : assets.profile_icon}
            alt="User"
          />

          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-20">
              <div className="flex flex-col gap-2 w-44 py-3 px-4 bg-white text-gray-500 rounded-lg shadow-md border border-gray-100">
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                </p>
                <p 
                  onClick={logout} 
                  className="cursor-pointer hover:text-black flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar Menu with Animation */}
      <motion.div
        className={`fixed top-0 right-0 h-screen bg-white shadow-xl z-50 ${
          visible ? "block" : "hidden"
        }`}
        initial={{ width: 0 }}
        animate={{ width: visible ? 280 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
          >
            <p className="font-medium">Menu</p>
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Close" />
          </div>

          <div className="py-6 flex flex-col items-center gap-2">
            <NavLink
              onClick={() => setVisible(false)}
              className={({isActive}) => 
                `py-3 w-full text-center transition-all duration-300 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
                }`
              }
              to="/"
            >
              HOME
            </NavLink>
            
            <NavLink
              onClick={() => setVisible(false)}
              className={({isActive}) => 
                `py-3 w-full text-center transition-all duration-300 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
                }`
              }
              to="/collection"
            >
              COLLECTION
            </NavLink>
            
            <NavLink
              onClick={() => setVisible(false)}
              className={({isActive}) => 
                `py-3 w-full text-center transition-all duration-300 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
                }`
              }
              to="/about"
            >
              ABOUT
            </NavLink>
            
            <NavLink
              onClick={() => setVisible(false)}
              className={({isActive}) => 
                `py-3 w-full text-center transition-all duration-300 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
                }`
              }
              to="/contact"
            >
              CONTACT
            </NavLink>
          </div>

          {token && (
            <div className="mt-auto p-4 border-t">
              <div className="flex flex-col gap-2">
                <p
                  onClick={() => {
                    navigate("/orders");
                    setVisible(false);
                  }}
                  className="cursor-pointer hover:text-indigo-600 flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Orders
                </p>
                <p 
                  onClick={() => {
                    logout();
                    setVisible(false);
                  }} 
                  className="cursor-pointer hover:text-indigo-600 flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
