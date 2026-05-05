import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-14 pb-6 relative overflow-hidden">
      
      {/* Gradient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-red-500/10 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* Left Section */}
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-4 tracking-wide">
            GD Cafe.
          </h2>

          <p className="text-sm leading-6 text-gray-400">
            Experience luxury dining with handcrafted coffee, gourmet meals,
            and delightful desserts. Every sip and bite is crafted with passion
            to give you a premium café experience like never before.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 rounded-full border border-gray-600 hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              <Facebook size={24} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="p-2 rounded-full border border-gray-600 hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              <Instagram size={24} />
            </a>

            <a
              href="mailto:gdcafe@gmail.com"
              aria-label="Email"
              className="p-2 rounded-full border border-gray-600 hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">
            COMPANY
          </h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-yellow-400 transition-all duration-300"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-yellow-400 transition-all duration-300"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/delivery"
                className="hover:text-yellow-400 transition-all duration-300"
              >
                Delivery
              </Link>
            </li>

            <li>
              <Link
                to="/privacy"
                className="hover:text-yellow-400 transition-all duration-300"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">
            GET IN TOUCH
          </h3>

          <p className="text-sm text-gray-400 mb-2">
            📞 +91-9068247501
          </p>

          <p className="text-sm text-gray-400 mb-2">
            ✉️ gdcafe@gmail.com
          </p>

          <p className="text-sm text-gray-400 mt-4">
            📍 Serving happiness with every cup ☕
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500 px-4">
        
        <p className="mb-2">
          © {new Date().getFullYear()} GD Cafe. All Rights Reserved.
        </p>

        <p className="text-gray-400">
          Designed & Owned by{" "}
          <span className="text-yellow-400 font-semibold">
            Lokesh
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;