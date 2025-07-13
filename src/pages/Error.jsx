import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col items-center text-center">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 heading-font mb-2">Oops! Something went wrong.</h1>
        <p className="text-gray-600 text-lg mb-6 para-font">
          The page you’re looking for doesn’t exist or an unexpected error has occurred.
        </p>
        <Link
          to="/"
          className="red-button button-font"
        >
          Go Home   
        </Link>
      </div>
    </div>
  );
};

export default Error;

