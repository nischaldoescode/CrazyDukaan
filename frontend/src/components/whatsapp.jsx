import React from "react";
const currentUrl = window.location.href;

const WhatsAppButton = ({ productUrl }) => {
  productUrl = currentUrl;
  const phoneNumber = "+918318042859"; // Example: Replace with your phone number

  // Define the custom message and include the product link
  const message = `Hey, I am interested in buying this product. Here is the link: ${productUrl}`;

  // URL encode the message
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URL with phone number and message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="flex justify-center space-x-4 items-center mb-2 bg-slate-100 py-3 border-stone-300 border-t-2 border-b-2">
      {/* When clicked on this user will be redirected */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:underline"
      >
        <p className="text-gray-700">Buy via WhatsApp</p>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#25D366",
          color: "white",
          padding: "10px 10px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        <img
          className="flex justify-center"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{ width: "20px", margin: "0 auto" }}
        />
      </a>
    </div>
  );
};

export default WhatsAppButton;
