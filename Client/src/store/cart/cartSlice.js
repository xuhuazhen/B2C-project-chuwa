import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    storeCartItems: (state, action) => {
      state.items = action.payload || [];
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);
      existingItem
        ? (existingItem.quantity += 1)
        : state.items.push({ ...product, quantity: 1 });

      state.totalItems += 1;
      state.totalPrice += product.price;
    },
    incrementItemQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item._id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += existingItem.price;
      }
    },
    decrementItemQuantity: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item._id === productId);
      if (existingItem && existingItem.quantity > 0) {
        existingItem.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= existingItem.price;

        if (existingItem.quantity === 0) {
          state.items = state.items.filter((item) => item._id !== productId);
        }
      }
    },
  },
});

export const {
  storeCartItems,
  clearCart,
  addToCart,
  incrementItemQuantity,
  decrementItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
