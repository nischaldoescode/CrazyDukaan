import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Oops! Page Not Found | Crazy Dukaan</title>
        <meta
          name="description"
          content="Oops! Seems you got lost, the page you are looking for does not exist."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100 p-9 mt-5">
        <img src={assets.error_img} alt="Not Found" className="w-65% mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Oops! Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Go Back To HomePage
        </button>
      </div>
    </>
  );
};

export default NotFoundPage;
