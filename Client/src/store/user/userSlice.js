import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { updateCartThunk} from '../cart/cartThunk';
import { storeCartItems } from '../cart/cartSlice';

export const fetchUserSession = createAsyncThunk(
  'user/fetchSession',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await api.get('/user/login', { withCredentials: true }); 

      if (res.data.status !== 'success') return rejectWithValue(null);

      console.log(res.data.data)
      const { cart, ...curUser } = res.data.data.user;
      const curCart = getState().cart.items;

      if ( curCart.length !== 0 && cart.length === 0 ) {
            dispatch(updateCartThunk(curCart));
      } else {
            dispatch(storeCartItems(cart)); //后期可修改成merge cart
      }
      console.log("authchecking", cart, curUser);

      return curUser;
    } catch {
      return rejectWithValue(null);
    }
  }
);


const initialState = {
    curUser: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        storeUser: (state, action) => {
            console.log(action.payload);
            state.curUser = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.curUser = null;
            state.isLoggedIn = false;
        }
    },
    extraReducers: (builder) => {
    builder
    //   .addCase(fetchUserSession.pending, (state) => {
    //     state.isLoading = true;
    //   })
      .addCase(fetchUserSession.fulfilled, (state, action) => { 
        state.curUser = action.payload
        state.isLoggedIn = true;
      })
      .addCase(fetchUserSession.rejected, (state) => { 
        state.isLoggedIn = false;
      });
  },
});

export const {storeUser, logout} = userSlice.actions;
export default userSlice.reducer;