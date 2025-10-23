import { createAsyncThunk } from '@reduxjs/toolkit';
import { storeCartItems } from './cartSlice';
import api from '../../api';

export const updateCartThunk = createAsyncThunk(
  'cart/updateCart',
  async ({ userId, prevCart }, { getState, dispatch, rejectWithValue }) => {
    try {
      const curCart = getState().cart.items.map( item => ({
        product: item.product._id,
        quantity: item.quantity
      }));
      console.log('cart to update:', curCart);

      const res = await api.post(
        `user/shopping-cart/${userId}`,
        { cart: curCart },
        { withCredentials: true }
      );
      console.log('updated cart:', res.data.data.cart);
      return res.data.data.cart;
    } catch (err) {
      // 回滚到 prev snapshot
      console.log('回滚');
      dispatch(storeCartItems(prevCart));
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const validatePromoCodeThunk = createAsyncThunk(
  'cart/validatePromoCode',
  async(code, { rejectWithValue }) => {
    try {
      const res = await api.post('user/validatePromoCode', { code });
      console.log(res.data.data);
      return res.data.data;   //code and discountRate
    } catch (err) {
      return rejectWithValue({
        code: null,
        discountRate: 0,
        message: err.response?.data?.message || 'Invalid code'
      });
    }
  }
)