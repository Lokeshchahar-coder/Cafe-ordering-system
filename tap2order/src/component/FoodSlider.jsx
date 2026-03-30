import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const FoodSlider = ({ addToCart }) => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://login1-7a2e0-default-rtdb.firebaseio.com/Menu.json"
      );

      const data = await res.json();

      const formattedData = data
        ? Object.entries(data).map(([id, item]) => ({
            id,
            ...item,
          }))
        : [];

      const bestSellerItems = formattedData.filter(
        (item) => item.isBestSeller
      );

      setBestSellers(bestSellerItems);
    } catch (err) {
      setError("Something went wrong 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);

    toast.success(
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-14 h-14 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-gray-300">Added to cart 🛒</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      }
    );
  };

  const SkeletonCard = () => (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 animate-pulse">
      <div className="w-full h-56 bg-gray-700 rounded-xl mb-4"></div>
      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading text-center mb-12"
        >
          🌟 <span className="text-yellow-400">Best Sellers</span>
        </motion.h2>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-400 font-medium">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && bestSellers.length === 0 && (
          <p className="text-center text-gray-400">
            No best sellers available 😕
          </p>
        )}

        {/* Cards */}
        {!loading && bestSellers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {bestSellers.map((item, index) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 object-cover hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Category */}
                  <span className="inline-block mt-2 px-3 py-1 text-xs bg-yellow-400/20 text-yellow-300 rounded-full">
                    {item.category}
                  </span>

                  {/* Rating */}
                  <div className="text-yellow-400 text-sm mt-2">
                    {"★".repeat(Math.round(item.rating || 0))}
                    {"☆".repeat(5 - Math.round(item.rating || 0))}
                    <span className="ml-2 text-gray-400 text-xs">
                      ({item.rating || 0})
                    </span>
                  </div>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-yellow-400">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="px-4 py-2 rounded-full bg-yellow-400 text-black font-medium hover:bg-yellow-300 hover:scale-105 transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <ToastContainer />
    </div>
  );
};

export default FoodSlider;