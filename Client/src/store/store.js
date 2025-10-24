import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./user/userSlice";
import productsReducer from "./product/productSlice";
import cartReducer from "./cart/cartSlice";
import searchReducer from "./search/searchSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // 仅持久化 cart，避免将敏感 user 信息放 localStorage
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  products: productsReducer,
  search: searchReducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;
