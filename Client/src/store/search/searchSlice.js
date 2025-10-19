import { createSlice } from "@reduxjs/toolkit";
import { fetchSearchThunk } from "./searchThunk";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    cache: {},
    status: "idle",
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.query = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSearchThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
        if (state.query) {
          state.cache[state.query] = action.payload; // cache results
        }
      })
      .addCase(fetchSearchThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setQuery, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
