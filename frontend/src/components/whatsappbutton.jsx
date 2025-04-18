import React from "react";
import { Navigate } from "react-router-dom";

const WhatsAppButton = ({ productUrl }) => {
  const currentUrl = window.location.href;
  const phoneNumber = "+918318042859"; // Example: Replace with your phone number

  // Define the custom message and include the product link
  const message = `Hey, I am interested in buying this product. Here is the link: ${currentUrl}`;

  // URL encode the message
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URL with phone number and message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <button className="flex bg-black text-white px-3 py-3 justify-center items-center gap-5 text-sm active:bg-gray-700 rounded-md hover:bg-black-400 hover:scale-105 transition ease-in-out duration-200 mt-5">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        <p className="text-white-700 text-base text-center">Buy via WhatsApp</p>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        style={{
          display: "inline-flex",
          backgroundColor: "#25D366",
          color: "white",
          padding: "8px 8px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        <img
          className="flex justify-center"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{ width: "15px" }}
        />
      </a>
    </button>
  );
};

export default WhatsAppButton;
