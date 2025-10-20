import { createAsyncThunk } from '@reduxjs/toolkit';
import { storeCartItems } from './cartSlice';
import api from '../../api';

export const updateCartThunk = createAsyncThunk(
  'cart/updateCart',
  async ({ userId, prevCart }, { getState, dispatch, rejectWithValue }) => {
    try {
      const curCart = getState().cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      // 与后端对齐：POST /api/user/shopping-cart/:id
      const res = await api.post(`user/shopping-cart/${userId}`, { cart: curCart });

      return res.data.data.cart;  // 后端返回的数据结构
    } catch (err) {
      // 回滚到快照
      dispatch(storeCartItems(prevCart));
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const validatePromoCodeThunk = createAsyncThunk(
  'cart/validatePromoCode',
  async (code, { rejectWithValue }) => {
    try {
      const res = await api.post('user/validatePromoCode', { code });
      return res.data.data;   // { code, discountRate }
    } catch (err) {
      return rejectWithValue({
        code: null,
        discountRate: 0,
        message: err.response?.data?.message || 'Invalid code'
      });
    }
  }
);
