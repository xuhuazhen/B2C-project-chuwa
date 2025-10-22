import { configureStore } from '@reduxjs/toolkit'; 
import userReducer from "./user/userSlice";
import productsReducer from "./product/productsSlice";
import cartReducer from "./cart/cartSlice";
import searchReducer from "./search/searchSlice";
  
 
 

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsReducer,
    search: searchReducer,
  }, 
  devTools: true,
});
 
export default store;
