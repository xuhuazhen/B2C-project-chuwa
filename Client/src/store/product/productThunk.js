import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../service/productService";

export const fetchProductThunk = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 10, sort }, { rejectWithValue }) => {
    try {
      const res = await getProducts(page, limit, sort);
      // console.log(res);
      return {
        products: res.products || [],
        pagination: res.pagination || {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
