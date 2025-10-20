// Client/src/store/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { updateCartThunk, validatePromoCodeThunk } from './cartThunk';

const initialState = {
  items: [],               // [{ product: {...}, quantity }]
  promoCode: null,
  discountRate: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 直接覆盖 items（用在初始化/乐观更新/回滚）
    storeCartItems: (state, action) => {
      state.items = action.payload || [];
    },
    // 调整某个商品数量
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((it) => it.product._id === productId);
      if (item) item.quantity = quantity;
    },
    // 移除某个商品
    removeItem: (state, action) => {
      state.items = state.items.filter((it) => it.product._id !== action.payload);
    },
    // 可选：清空
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.discountRate = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 更新购物车（与 updateCartThunk 对齐）
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
        state.error = action.payload || 'Failed to update cart';
      })

      // 校验优惠码
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
  updateQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
