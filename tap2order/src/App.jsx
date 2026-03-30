
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Carousel from "./component/Slider";
import FoodGridWithCart from "./component/FoodGrid";
import Footer from "./component/Footer";
import Cart from "./component/Cart";
import Pizza from "./component/Pizza";
import Payment from "./component/Payment";
import Admin from "./component/Admin";
import Menu from "./component/Menu";
import Checkout from "./component/Track";
import Bill from "./component/Bill";
import Banner from "./component/Banner";
import Navbar from "./component/Navbar";
import AdminLogin from "./component/Login";
import FoodSlider from "./component/FoodSlider";
import Order from "./component/Order";
import Policy from "./component/Policy"
import ProtectedRoute from "./store/ProtectedRoute";

const AppContent = ({ cartItems, setCartItems, handleAddToCart }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin") || location.pathname.startsWith("/login") || location.pathname.startsWith("/bill");

  return (
    <div className="bg-gray-50 min-h-screen">
      {!isAdminPath && <Navbar cartItems={cartItems} />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Carousel />
              <FoodSlider addToCart={handleAddToCart} />
              <Banner />
              <FoodGridWithCart cartItems={cartItems} setCartItems={setCartItems} />
            </>
          }
        />
        <Route path="/food-slider" element={<FoodSlider addToCart={handleAddToCart} />} />
        <Route path="/pizza" element={<Pizza cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/bill" element={<Bill />} />
        <Route path="/menu" element={<FoodGridWithCart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route
          path="/manage-menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={<Order />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/about" element={<Policy />} />
        <Route path="/delivery" element={<Policy />} />
        <Route path="/privacy" element={<Policy />} />
        <Route path="/contact" element={<Policy />} />
      </Routes>
      <Footer />
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
    } else {
      const updatedCart = [...cartItems, { ...item, qty: 1 }];
      setCartItems(updatedCart);
    }
  };

  return (
    <Router>
      <AppContent
        cartItems={cartItems}
        setCartItems={setCartItems}
        handleAddToCart={handleAddToCart}
      />
    </Router>
  );
};

export default App;
