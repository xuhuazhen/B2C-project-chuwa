import { createThunk } from "../../utils/createThunks";
import { getProducts } from "../../service/productService";
import { createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createThunk(
  "products/getProducts",
  getProducts, //call get all products api
  "products" //extract the products array from API response
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
