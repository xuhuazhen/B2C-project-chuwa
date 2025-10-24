import { createSlice } from "@reduxjs/toolkit";
import { updateCartThunk, validatePromoCodeThunk } from "./cartThunk";

const initialState = {
  items: [],          // [{ product, quantity }]
  promoCode: null,
  discountRate: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    storeCartItems: (state, action) => {
      state.items = action.payload || [];
    },

    // 新增：支持一次性加 n 件
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload || {};
      if (!product || !product._id) return;
      const ex = state.items.find((it) => it.product._id === product._id);
      if (ex) {
        ex.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },

    // 设定为指定数量；<=0 时移除
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const idx = state.items.findIndex((it) => it.product._id === productId);
      if (idx === -1) return;
      if (quantity <= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items[idx].quantity = quantity;
      }
    },

    // 移除
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (it) => it.product._id !== action.payload
      );
    },

    resetCart: () => ({ ...initialState }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(updateCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update cart";
      })
      .addCase(validatePromoCodeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(validatePromoCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload.code;
        state.discountRate = action.payload.discountRate;
      })
      .addCase(validatePromoCodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload.code;
        state.discountRate = action.payload.discountRate;
      });
  },
});

export const {
  storeCartItems,
  addToCart,
  updateQuantity,
  removeItem,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
