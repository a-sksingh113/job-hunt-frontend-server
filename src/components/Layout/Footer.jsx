import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-xl font-semibold mb-0 heading-font"> Developer Info - Contact Us</p>
        <p className="para-font">Email Us : pixbit2025@gmail.com | Phone: +91 8112590073</p>

        <div className="border-t border-gray-700 my-2"></div>
        <p className="para-font">&copy; {new Date().getFullYear()} All rights reserved. Made with ❤️ by Pixbit.</p>
      </div>
    </footer>
  );
};

export default Footer;

