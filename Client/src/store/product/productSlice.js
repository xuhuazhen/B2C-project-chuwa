import { createSlice } from "@reduxjs/toolkit";
import { fetchProductThunk } from "./productThunk";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: {}, //page-based cache
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    sort: "-createdAt",
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.currentPage = 1;
      state.products = {}; //Clear cache when sort changes
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductThunk.fulfilled, (state, action) => {
        const { page, products, totalPages } = action.payload;
        state.loading = false;
        state.products[page] = products; //cache products by page
        state.totalPages = totalPages;
      })
      .addCase(fetchProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setSort, setLimit } = productsSlice.actions;
export default productsSlice.reducer;
