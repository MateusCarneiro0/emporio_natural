import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";

const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    const id = JSON.parse(localStorage.getItem("id"));
    if (!id) return null;
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`);
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export default getLocalStorage;
