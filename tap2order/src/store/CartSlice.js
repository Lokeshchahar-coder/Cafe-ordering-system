// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Add item to cart logic
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.qty += 1; // Increment quantity if the item is already in the cart
      } else {
        state.cart.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    // Other actions like update quantity can go here
  },
});

// Export actions
export const { addToCart, removeFromCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;