import React from "react";

const Banner = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"
        alt="Luxury Coffee Banner"
        className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700 ease-in-out"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 text-white">
        
        {/* Tagline */}
        <p className="uppercase tracking-[4px] text-sm text-gray-300 mb-3">
          Premium Experience
        </p>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-xl">
          Discover the Taste of{" "}
          <span className="text-yellow-400">Best Coffee</span>
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-md text-gray-200 text-sm md:text-base">
          Crafted with perfection, brewed for moments that matter. Elevate your
          coffee experience like never before.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-lg">
            Explore Menu
          </button>

          <button className="px-6 py-3 border border-white/60 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Glass Effect Bottom Strip */}
      <div className="absolute bottom-0 w-full backdrop-blur-md bg-white/10 py-4 px-6 flex justify-between text-white text-sm">
        <span>✨ 100% Organic Beans</span>
        <span>🚚 Free Delivery</span>
        <span>🔥 Freshly Brewed</span>
      </div>
    </div>
  );
};

export default Banner;