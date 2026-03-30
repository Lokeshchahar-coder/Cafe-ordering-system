import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const carouselItems = [
  {
    id: 1,
    title: "Fresh Brewed Coffee",
    description: "Start your day with a smooth, aromatic cup made just for you.",
    image:
      "https://media.istockphoto.com/id/1271386167/photo/coffee.jpg?s=612x612&w=0&k=20&c=5gWShBS-lSa_ycm1_olcm9wric7dKYNMMm8Q780-A74=",
  },
  {
    id: 2,
    title: "Cozy Cafe Vibes",
    description: "A warm spot to relax, work, or catch up with friends.",
    image:
      "https://media.istockphoto.com/id/1187573926/photo/friends-group-drinking-cappuccino-at-coffee-bar-people-talking-and-having-fun-together-at.jpg?s=612x612&w=0&k=20&c=cZsGZbMEeWBBYpOkiMYWxVv7SC4J5iPkhgHdNPch8ZU=",
  },
  {
    id: 3,
    title: "Sweet Treats",
    description: "Indulge in desserts and snacks made fresh daily.",
    image:
      "https://plus.unsplash.com/premium_photo-1665669263531-cdcbe18e7fe4?q=80&w=1825&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === carouselItems.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Navigation
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  return (
    <div className="px-4 md:px-10 py-8 bg-white">
      <div className="relative overflow-hidden rounded-3xl h-[60vh] md:h-[80vh] shadow-xl">

        {/* SLIDES */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <div
              key={item.id}
              className="min-w-full h-full relative"
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* TEXT CONTENT */}
              <div className="absolute bottom-10 left-6 md:left-12 text-white max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-3">
                  {item.title}
                </h2>
                <p className="text-sm md:text-lg mb-4 opacity-90">
                  {item.description}
                </p>

                <button
                  onClick={() => navigate("/menu")}
                  className="bg-green-600 px-6 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Explore Menu
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40 transition"
        >
          ‹
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40 transition"
        >
          ›
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2">
          {carouselItems.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                currentIndex === index
                  ? "w-6 bg-green-500"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;