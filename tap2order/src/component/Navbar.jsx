import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isAdminAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";

  const goTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminToken");
    goTo("/login");
  };

  // 🔥 Hide/Show Navbar on Scroll (Optimized)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY.current && currentScroll > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } backdrop-blur-lg bg-white/70 shadow-sm border-b border-gray-200`}
    >
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 md:px-12 py-4 relative">

        {/* LOGO */}
        <div
          className="flex items-center cursor-pointer z-10"
          onClick={() => goTo("/")}
        >
          <img
            src="https://images.unsplash.com/photo-1634937743837-48861cf51a9c"
            alt="GD Cafe"
            className="h-10 md:h-12 object-contain rounded-md"
          />
        </div>

        {/* 👑 LUXURY CENTER TITLE */}
        <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
          <h1 className="text-xl md:text-4xl font-serif tracking-[0.25em] text-[#1b4332]">
            GD CAFE
          </h1>

          {/* Golden Accent Line */}
          <div className="h-[2px] w-12 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 mx-auto mt-1 rounded-full"></div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium z-10">
          {["Home", "Menu", "About"].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.toLowerCase() === "home") {
                  goTo("/");
                } else if (item.toLowerCase() === "menu") {
                  goTo(isAdminAuthenticated ? "/manage-menu" : "/menu");
                } else {
                  goTo(`/${item.toLowerCase()}`);
                }
              }}
              className="relative group"
            >
              <span className="group-hover:text-[#1b4332] transition duration-300">
                {item}
              </span>

              {/* underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#1b4332] transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}

          {/* LOGIN / LOGOUT BUTTON */}
          {isAdminAuthenticated ? (
            <button
              onClick={handleLogout}
              className="border border-red-600 text-red-600 px-5 py-2 rounded-full hover:bg-red-600 hover:text-white transition duration-300 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => goTo("/login")}
              className="border border-[#1b4332] text-[#1b4332] px-5 py-2 rounded-full hover:bg-[#1b4332] hover:text-white transition duration-300 active:scale-95"
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE ICON */}
        <div className="md:hidden z-10">
          {isOpen ? (
            <X
              size={28}
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          ) : (
            <Menu
              size={28}
              onClick={() => setIsOpen(true)}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-4 flex flex-col gap-4 bg-white/90 backdrop-blur-md text-gray-700 font-medium shadow-md">
          <button onClick={() => goTo("/")} className="text-left hover:text-[#1b4332]">
            Home
          </button>
          <button
            onClick={() => goTo(isAdminAuthenticated ? "/manage-menu" : "/menu")}
            className="text-left hover:text-[#1b4332]"
          >
            Menu
          </button>
          <button onClick={() => goTo("/about")} className="text-left hover:text-[#1b4332]">
            About
          </button>
          {isAdminAuthenticated ? (
            <button
              onClick={handleLogout}
              className="border border-red-600 text-red-600 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => goTo("/login")}
              className="border border-[#1b4332] text-[#1b4332] py-2 rounded-full hover:bg-[#1b4332] hover:text-white transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* INFO BAR */}
      <div className="bg-[#1b4332] text-white text-center py-2 text-sm font-light tracking-wide">
        ☕ Premium Cafe Experience — Call Now:{" "}
        <a href="tel:+919068247501" className="underline">
          +91 90682 47501
        </a>
      </div>
    </header>
  );
};

export default Header;