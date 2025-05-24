import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import TermsCondition from "./components/TermsConditions";
import FrequentyAskedQuestions from "./components/FrequentlyQuestions";
// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Loader from "./pages/Loader";

// import Verify from './pages/Verify';
import NotFoundPage from "./pages/404";

const App = () => {
  const location = useLocation();

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Modern vertical slide-up animation - much faster and smoother
  const pageVariants = {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2, // Much faster - only 0.2 seconds
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: {
        duration: 0.15, // Even faster exit
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-orange-100">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Loader />
      
      {/* Navbar placed outside AnimatePresence for better UX */}
      <SearchBar />
      <Navbar />
      
      <main className="flex-grow px-2 sm:px-[2vw] md:px-[3vw] lg:px-[5vw]">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Home />
                </motion.div>
              }
            />

            <Route
              path="/collection"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Collection />
                </motion.div>
              }
            />

            <Route
              path="/about"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <About />
                </motion.div>
              }
            />

            <Route
              path="/contact"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Contact />
                </motion.div>
              }
            />

            <Route
              path="/product/:productId"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Product />
                </motion.div>
              }
            />

            <Route
              path="/cart"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Cart />
                </motion.div>
              }
            />

            <Route
              path="/login"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Login />
                </motion.div>
              }
            />

            <Route
              path="/place-order"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <PlaceOrder />
                </motion.div>
              }
            />

            <Route
              path="/orders"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Orders />
                </motion.div>
              }
            />

            <Route
              path="/termsconditions"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TermsCondition />
                </motion.div>
              }
            />

            <Route
              path="/frequentlyaskedquestions"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <FrequentyAskedQuestions />
                </motion.div>
              }
            />
            <Route
              path="*"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <NotFoundPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>

        <Footer />
      </main>
    </div>
  );
};

export default App;
