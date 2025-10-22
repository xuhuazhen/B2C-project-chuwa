import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSearch } from "../../service/productService";

export const fetchSearchThunk = createAsyncThunk(
  "search/fetchSearchResults", //action type
  //run when the thunk is dispatched
  async (query, { signal, getState }) => {
    //handle duplicates query: avoid sending API calls again
    const { cache } = getState().search;
    if (cache[query]) return cache[query];

    try {
      const data = await getSearch(query, signal);

      // console.log("API response:", data);

      return data.products;
    } catch (err) {
      if (err.name === "AbortError" || err.name === "CanceledError") return [];
      throw err;
    }
  }
);
