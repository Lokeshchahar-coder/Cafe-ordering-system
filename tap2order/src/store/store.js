// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice"; // Ensure correct path to cartSlice

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;