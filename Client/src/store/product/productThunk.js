import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../service/productService";

export const fetchProductThunk = createAsyncThunk(
  "products/fetchProducts",
  async (
    { page = 1, limit = 10, sort = "-createdAt" },
    { rejectWithValue }
  ) => {
    try {
      const data = await getProducts(page, limit, sort);
      return {
        products: data.products,
        page,
        totalPages: data.pagination.totalPages,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
