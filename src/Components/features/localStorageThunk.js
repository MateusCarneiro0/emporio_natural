import { createAsyncThunk } from "@reduxjs/toolkit";
import { idKey } from "../../secretKeys";
import requestJson from "./requestJson";

const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    const id = JSON.parse(localStorage.getItem(idKey));
    if (!id) return null
    
    try {
      const data = await requestJson(`/users/fetch/${id}`)
      return data
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  },
);

export default getLocalStorage;
