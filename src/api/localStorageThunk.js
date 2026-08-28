import { createAsyncThunk } from "@reduxjs/toolkit";
import requestJson from "./requestJson";
const existsCookie = (cookieName) => {
  return `; ${document.cookie}`.includes(`; ${cookieName}=`);
};
const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    try {
      const is_logged = existsCookie("is_logged");
      if (!is_logged) return null;

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
