import { createSelector } from "@reduxjs/toolkit";

export const selectCartItems = (state) => state.cart.items;

// Memoized selector for a single cart item
export const makeSelectCartItemById = (productId) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item._id === productId)
  );
