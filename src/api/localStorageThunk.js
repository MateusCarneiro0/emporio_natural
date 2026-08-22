import { createAsyncThunk } from "@reduxjs/toolkit";
import { idKey, refreshTokenKey } from "../secretKeys";
import requestJson from "./requestJson";

const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    try {
      const id = JSON.parse(localStorage.getItem(idKey));
      if (!id) return null;
      const data = await requestJson(`/users/me`);
      return data;
    } catch (err) {
      localStorage.removeItem(refreshTokenKey);
      localStorage.removeItem(idKey);
      if (err?.status === 401 || err?.status === 422)
        
        return rejectWithValue({ error: "invalid" });
      return rejectWithValue(err.message);
    }
  },
);

export default getLocalStorage;
