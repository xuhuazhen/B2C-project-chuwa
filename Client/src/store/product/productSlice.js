import { createSlice } from "@reduxjs/toolkit";
import { fetchProductThunk } from "./productThunk";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    loading: false,
    error: null,
    sort: "latest",
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.limit = action.payload.pagination.limit;
      })

      .addCase(fetchProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setSort, setSearch, clearSearchResults } =
  productsSlice.actions;
export default productsSlice.reducer;
