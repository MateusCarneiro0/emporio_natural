import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, idKey } from "../../secretKeys";

const getLocalStorage = createAsyncThunk(
  "auth/getLocalStorage",
  async (_, { rejectWithValue }) => {
    const id = JSON.parse(localStorage.getItem(idKey));
    if (!id) return null
    
    try {
      const response = await fetch(`${BASE_URL}/users/fetch/${id}`);
      if (!response.ok){
        return null
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  },
);

export default getLocalStorage;
