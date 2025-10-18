import { createAsyncThunk } from "@reduxjs/toolkit";

export function createThunk(actionType, apiFn, dataKey = null) {
  return createAsyncThunk(actionType, async (payload, { rejectWithValue }) => {
    try {
      const response = await apiFn(payload);
      return dataKey ? response[dataKey] : response;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  });
}
