import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { storeCartItems } from './cartSlice';

export const updateCartThunk = createAsyncThunk(
  'cart/updateCart',
  async ({ userId, items }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/user/${userId}/updatecart`,
        { cart: items },
        { withCredentials: true }
      );

      // 更新前端 store
      dispatch(storeCartItems(res.data.cart));
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);