import { createSlice } from "@reduxjs/toolkit";
import getLocalStorage from "../api/localStorageThunk";

const initialState = {
  cartProducts: [],
  isLoading: false,
  error: "",
};

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadingCart(sta) {
      sta.isLoading = true;
    },
    receiveCart(sta, act) {
      sta.cartProducts = act.payload;
      sta.isLoading = false;
      sta.error = "";
    },
    rejected(sta, act) {
      sta.isLoading = false;
      sta.error = act.payload;
    },
    addProductCart(sta, act) {
      sta.cartProducts = sta.cartProducts?.filter(
        (product) => product.id !== act.payload.id,
      );
      sta.cartProducts = sta.cartProducts?.length
        ? [...sta.cartProducts, act.payload]
        : [act.payload];
      sta.isLoading = false;
      sta.error = "";
    },
    removeProductCart(sta, act) {
      sta.cartProducts = sta.cartProducts.filter(
        (product) => product.id !== act.payload,
      );
      sta.isLoading = false;
      sta.error = "";
    },
    payCart(sta, act) {
      sta.cartProducts = [];
      sta.isLoading = false;
      sta.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalStorage.pending, (sta) => {
        sta.isLoading = true;
      })
      .addCase(getLocalStorage.fulfilled, (sta, act) => {
        if (act.payload !== null) {
          sta.isLoading = false;
          sta.error = "";
          sta.cartProducts = act.payload.cart;
        }
      });
  },
});

export default cartReducer.reducer;
