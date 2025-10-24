import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../service/productService";

export const fetchProductThunk = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 8, sort = "-createdAt" }, { rejectWithValue }) => {
    try {
      const data = await getProducts(page, limit, sort);
      return {
        products: data.products,
        page,
        limit,
        sort,
        totalPages: data.pagination.totalPages,
        cacheKey: data.cacheKey, //include from backend
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
