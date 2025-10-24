import { createSlice } from "@reduxjs/toolkit";
import { fetchProductThunk } from "./productThunk";

//Load saved preferences (page, sort, limit)
const savedPage = Number(localStorage.getItem("page")) || 1;
const savedSort = localStorage.getItem("sort") || "-createdAt";
const savedLimit = Number(localStorage.getItem("limit")) || 8;

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: {}, // cached by `${page}-${limit}-${sort}`
    currentPage: savedPage,
    sort: savedSort,
    limit: savedLimit,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      localStorage.setItem("page", action.payload);
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      localStorage.setItem("sort", action.payload);
      state.currentPage = 1;
      localStorage.setItem("page", 1);
      state.products = {}; //clear cache when sort changes
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      localStorage.setItem("limit", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductThunk.fulfilled, (state, action) => {
        const { products, totalPages, cacheKey } = action.payload;
        state.loading = false;
        state.products[cacheKey] = products; //use backend-provided cacheKey
        state.totalPages = totalPages;
      })
      .addCase(fetchProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setCurrentPage, setSort, setLimit } = productsSlice.actions;
export default productsSlice.reducer;
