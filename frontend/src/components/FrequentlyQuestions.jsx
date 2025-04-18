import React, { useState, useContext } from "react";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const FrequentlyQuestions = () => {
  const { token } = useContext(ShopContext); 
  const navigate = useNavigate();
  const [expandedQuestions, setExpandedQuestions] = useState({
    exchange: false,
    contact: false,
    replacement: false,
    cancellation: false,
    response: false,
    offers: false,
    refund: false
  });

  const toggleQuestion = (question) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-800">
      <Title text1="Frequently Asked" text2="Questions" />

      <p className="mb-8 text-gray-600 text-sm sm:text-base">
        Your satisfaction is our priority. Please find answers to common inquiries below.
      </p>

      {/* Exchange Policy */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.exchange
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("exchange")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            What is your product exchange policy?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.exchange ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.exchange && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-sm sm:text-base">
              We offer a seamless exchange process to ensure your complete satisfaction:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                Items must be returned to our distribution center with original packaging
              </li>
              <li>Please include documentation of the product condition</li>
              <li>Exchanges are processed within 24 hours of receipt</li>
              <li>Standard shipping fees apply for return shipments</li>
            </ul>
            <p className="mt-2 text-orange-600 font-medium text-sm sm:text-base">
              This verification process maintains the integrity of our exchange program for all valued customers.
            </p>
          </div>
        )}
      </div>

      {/* Refund Policy */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.refund
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("refund")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            What is your refund policy?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.refund ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.refund && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-sm sm:text-base">
              We process refunds promptly upon receipt and verification of returned items:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>Refunds are issued within 1-2 business days after we receive your return</li>
              <li>The refund will be credited to your original payment method</li>
              <li>Please allow 5-7 business days for the refund to reflect in your account</li>
            </ul>
            <p className="mt-2 text-orange-600 font-medium text-sm sm:text-base">
              Our team works diligently to ensure timely processing of all refund requests.
            </p>
          </div>
        )}
      </div>

      {/* Contact Method */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.contact
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("contact")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            How may I contact customer support regarding exchanges?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.contact ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.contact && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-sm sm:text-base">
              Our customer service team is available to assist you with any exchange inquiries:
            </p>
            <button
              className="mt-3 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-gray-800 rounded-md transition-colors duration-200 text-sm sm:text-base"
              onClick={() => navigate("/about#team-section")}
            >
              Contact Support Team
            </button>
          </div>
        )}
      </div>

      {/* Replacement Timeline */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.replacement
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("replacement")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            What is the processing time for replacements?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.replacement ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.replacement && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-sm sm:text-base">
              We expedite all replacement orders with priority processing:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>Replacements are typically processed within 48 hours of return receipt</li>
              <li>You will receive tracking information once your replacement ships</li>
            </ul>
            <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Loyal customers may experience accelerated processing times
            </div>
          </div>
        )}
      </div>

      {/* Order Cancellation */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.cancellation
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("cancellation")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            What is your order cancellation policy?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.cancellation ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.cancellation && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-sm sm:text-base">
              To maintain our efficient fulfillment process:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>Cancellations must be requested within 2 hours of payment</li>
              <li>After this window, orders enter our fulfillment system and cannot be canceled</li>
              <li>For exceptional circumstances, please contact our support team immediately</li>
            </ul>
            <p className="mt-2 text-orange-600 font-medium text-sm sm:text-base">
              This policy allows us to maintain our commitment to fast order processing.
            </p>
          </div>
        )}
      </div>

      {/* Response Time */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.response
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("response")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            What is your customer service response time?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.response ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.response && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-sm sm:text-base">
              Our dedicated support team responds to all inquiries within{" "}
              <span className="font-medium">24-48 hours</span> during business days.
            </p>
            <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Priority response is given to time-sensitive matters
            </div>
          </div>
        )}
      </div>

      {/* Exclusive Offers */}
      <div
        className={`mb-4 p-4 sm:p-5 border rounded-lg transition-all duration-300 ${
          expandedQuestions.offers
            ? "bg-gray-50"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
        onClick={() => toggleQuestion("offers")}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            Are there exclusive benefits for registered users?
          </h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedQuestions.offers ? "−" : "+"}
          </span>
        </div>

        {expandedQuestions.offers && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            {token ? (
              <>
                <p className="text-sm sm:text-base">
                  Registered users enjoy exclusive benefits including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>Early access to new product launches</li>
                  <li>Members-only promotions and discounts</li>
                  <li>Personalized product recommendations</li>
                </ul>
                <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-2 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Exclusive offers are delivered directly to your registered email
                </div>
              </>
            ) : (
              <>
                <p className="text-sm sm:text-base">
                  Registration unlocks premium benefits and exclusive offers.
                </p>
                <button
                  className="mt-3 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-gray-800 rounded-md transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => navigate("/login")}
                >
                  Sign In or Register for Benefits
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-gray-100 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-2 text-gray-700 text-base sm:text-lg">
          Require additional assistance?
        </h3>
        <p className="text-gray-600 mb-3 text-sm sm:text-base">
          Our customer care specialists are available to address any questions or concerns.
        </p>
        <button 
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors duration-200 shadow-sm text-sm sm:text-base" 
          onClick={() => navigate("/about#team-section")}
        >
          Contact Customer Support
        </button>
      </div>
    </div>
  );
};

export default FrequentlyQuestions;