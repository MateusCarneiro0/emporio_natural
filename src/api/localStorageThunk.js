import { createAsyncThunk } from "@reduxjs/toolkit";
import { idKey } from "../secretKeys";
import requestJson from "./requestJson";

const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    try {
      const id = JSON.parse(localStorage.getItem(idKey));
      if (!id) return null;
      const data = await requestJson(`/users/fetch/${id}`);
      return data;
    } catch (err) {
      localStorage.removeItem(idKey); //Removing the corrupted key
      if (err?.status === 401 || err?.status === 422)
        return rejectWithValue({ error: "invalid" });
      return rejectWithValue(err.message);
    }
  },
);

export default getLocalStorage;
