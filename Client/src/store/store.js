import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
// import productReducer from "./product/productSlice";
import cartReducer from "./cart/cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
 // products: productReducer,
  },
  devTools: true, 
});

export default store;