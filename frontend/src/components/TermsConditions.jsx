import React, { useState } from 'react';
import Title from './Title';
import './Terms.css'
import {Helmet} from "react-helmet";

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({
    dataCollection: false,
    productAuthenticity: false,
    deliveryInfo: false,
    dataResponsibility: false,
    paymentSecurity: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [showInfo, setShowInfo] = useState({
    data: false,
    delivery: false,
    products: false
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-800">
      <Title text1="Our" text2="Privacy Policy" />
      
      <p className="mb-8 text-gray-600">
        This document outlines how we manage and protect your data. We encourage you to read through it carefully.
      </p>

      {/* Data Collection Section */}
      <div 
        className={`mb-6 p-5 border rounded-lg transition-all duration-300 ${expandedSections.dataCollection ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
        onClick={() => toggleSection('dataCollection')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Data Collection Practices</h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedSections.dataCollection ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.dataCollection && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p>
              We collect a variety of information to enhance your shopping experience, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Personal identification details (e.g., name, email address)</li>
              <li>Demographic data (e.g., age, gender)</li>
            </ul>
            <div className="relative mt-3">
              <button 
                className="text-sm bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center"
                onMouseEnter={() => setShowInfo({...showInfo, data: true})}
                onMouseLeave={() => setShowInfo({...showInfo, data: false})}
              >
                i
              </button>
              {showInfo.data && (
                <div className="absolute left-8 top-0 bg-white p-3 shadow-lg rounded-lg z-10 w-64 text-sm animate-fadeIn">
                  This data helps us personalize services and improve your experience.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Authenticity */}
      <div 
        className={`mb-6 p-5 border rounded-lg transition-all duration-300 ${expandedSections.productAuthenticity ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
        onClick={() => toggleSection('productAuthenticity')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Product Authenticity</h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedSections.productAuthenticity ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.productAuthenticity && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p>
              Our offerings prioritize a balance of quality and affordability. While they may not always align with premium brand standards, we assure you of their value and usability.
            </p>
            <div className="relative mt-3">
              <button 
                className="text-sm bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center"
                onMouseEnter={() => setShowInfo({...showInfo, products: true})}
                onMouseLeave={() => setShowInfo({...showInfo, products: false})}
              >
                i
              </button>
              {showInfo.products && (
                <div className="absolute left-8 top-0 bg-white p-3 shadow-lg rounded-lg z-10 w-64 text-sm animate-fadeIn">
                  "Best value" doesn't imply authenticity but rather superior value for money.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Information */}
      <div 
        className={`mb-6 p-5 border rounded-lg transition-all duration-300 ${expandedSections.deliveryInfo ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
        onClick={() => toggleSection('deliveryInfo')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Delivery Terms</h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedSections.deliveryInfo ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.deliveryInfo && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p>
              Delivery timelines can vary depending on:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Location and regional access</li>
              <li>Logistics and transportation</li>
              <li>Stock availability</li>
              <li>Unforeseen disruptions or weather-related events</li>
            </ul>
            <p className="mt-2">
              We currently apply a uniform delivery fee, but this may change as per business requirements.
            </p>
            <div className="relative mt-3">
              <button 
                className="text-sm bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center"
                onMouseEnter={() => setShowInfo({...showInfo, delivery: true})}
                onMouseLeave={() => setShowInfo({...showInfo, delivery: false})}
              >
                i
              </button>
              {showInfo.delivery && (
                <div className="absolute left-8 top-0 bg-white p-3 shadow-lg rounded-lg z-10 w-64 text-sm animate-fadeIn">
                  Delivery charges may vary and are subject to change based on location and conditions.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Responsibility */}
      <div 
        className={`mb-6 p-5 border rounded-lg transition-all duration-300 ${expandedSections.dataResponsibility ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
        onClick={() => toggleSection('dataResponsibility')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Data Responsibility</h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedSections.dataResponsibility ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.dataResponsibility && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p>
              While we employ industry-standard security practices to protect your data, we cannot guarantee absolute security. By using our platform, you acknowledge and accept the inherent risks of data transmission.
            </p>
            <p className="mt-2">
              In the event of any data-related incidents, we will act swiftly to inform and protect our users to the best of our ability.
            </p>
          </div>
        )}
      </div>

      {/* Payment Security */}
      <div 
        className={`mb-6 p-5 border rounded-lg transition-all duration-300 ${expandedSections.paymentSecurity ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
        onClick={() => toggleSection('paymentSecurity')}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Payment Security</h3>
          <span className="text-xl transform transition-transform duration-300">
            {expandedSections.paymentSecurity ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.paymentSecurity && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <p>
              Payments are securely processed via Razorpay's Payment Gateway. We take extensive precautions to ensure your transactions are handled securely.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Note: All transactions are final. Chargebacks may result in termination of services.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">Final Acknowledgment</h3>
        <p className="text-gray-600">
          By continuing to use our platform, you agree to the terms outlined above. These terms may be updated from time to time without prior notice.
        </p>
      </div>

      <div className="mt-8 p-5 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">Order Cancellation</h3>
        <p className="text-gray-600">
          Please note that we currently do not accept order cancellations once an order has been placed. If you wish to cancel, you must contact us within 2 hours of receiving the order confirmation.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
