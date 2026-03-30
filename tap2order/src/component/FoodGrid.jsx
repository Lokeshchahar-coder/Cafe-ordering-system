import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "sweetalert2/dist/sweetalert2.min.css";

const FoodGridWithCart = ({ cartItems, setCartItems }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchFoods = async () => {
    try {
      const response = await fetch(
        "https://login1-7a2e0-default-rtdb.firebaseio.com/Menu.json"
      );
      const data = await response.json();
      const formattedData = data
        ? Object.entries(data).map(([id, food]) => ({
            id,
            ...food,
          }))
        : [];
      setFoods(formattedData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load food items.",
        background: "#fff",
        color: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(foods.map((f) => f.category))],
    [foods]
  );

  const filteredFoods = useMemo(
    () =>
      foods.filter((food) => {
        const matchesCategory =
          selectedCategory === "All" || food.category === selectedCategory;
        const matchesSearch =
          food.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        return matchesCategory && matchesSearch && food.isAvailable;
      }),
    [foods, selectedCategory, searchQuery]
  );

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

    Swal.fire({
      title: item.name,
      text: "Added to cart 🛒",
      imageUrl: item.image,
      background: "#fff",
      color: "#000",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
      
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-800"
      >
        Discover <span className="text-yellow-500">Best Food</span>
      </motion.h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-yellow-500 text-white shadow-md scale-105"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">
            Loading food items...
          </p>
        ) : filteredFoods.length > 0 ? (
          filteredFoods.map((food, index) => (
            <div
              key={food.id}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-lg">
                <img
                  src={food.image}
                  alt={food.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-52 object-cover hover:scale-110 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {food.name}
                </h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {food.description}
                </p>

                {/* Category */}
                <span className="inline-block mt-3 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                  {food.category}
                </span>

                {/* Rating */}
                <div className="text-yellow-500 mt-2 text-sm">
                  {"★".repeat(Math.round(food.rating || 0))}
                  {"☆".repeat(5 - Math.round(food.rating || 0))}
                </div>

                {/* Price + Button */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-green-600">
                    ₹{food.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(food)}
                    className="px-4 py-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No items found.
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodGridWithCart;