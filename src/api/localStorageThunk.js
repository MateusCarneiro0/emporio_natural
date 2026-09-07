import { createAsyncThunk } from "@reduxjs/toolkit";
import requestJson from "./requestJson";

const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    try {
      const data = await requestJson("/users/me", { method: "GET" });
      return data;
    } catch (err) {
      if (err?.status === 401 || err?.status === 422)
        return rejectWithValue({ error: "invalid" });
      return rejectWithValue(err.message);
    }
  },
);

export default getLocalStorage;
