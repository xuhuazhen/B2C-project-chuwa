import { createSlice } from "@reduxjs/toolkit";
import { createThunk } from "../../utils/createThunks";
import { getSearch } from "../../service/productService";

export const fetchSearchResults = createThunk(
  "search/fetchResults",
  getSearch, //call search api
  "products" //extract the products array from API response
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    isFetching: false,
    error: null,
    query: "",
  },
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.query = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state, action) => {
        state.isFetching = true;
        state.error = null;
        state.query = action.meta.arg;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isFetching = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
        state.results = [];
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
