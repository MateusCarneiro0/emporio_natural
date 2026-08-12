import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import getLocalStorage from "../api/localStorageThunk";
import { authRejected, logout, rejected, rejectedSignup, clearErrors } from "./authSlice";
const initialState = {
  cartProducts: [],
  isLoading: false,
  error: "",
  operationText: "",
};

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadingCart(sta) {
      sta.isLoading = true;
    },
    addOperationText(sta, act) {
      sta.operationText = act.payload;
    },
    cleanOperationText(sta) {
      sta.operationText = "";
    },
    receiveCart(sta, act) {
      if (act.payload.id) {
        sta.cartProducts = act.payload;
        sta.isLoading = false;
        sta.error = "";
      }
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
    payCart(sta) {
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
        if (act.payload !== null && act.payload.cart) {
          sta.error = "";
          sta.cartProducts = act.payload.cart;
        } else {
          sta.cartProducts = [];
        }
        sta.isLoading = false;
      })
      .addCase(getLocalStorage.rejected, (sta) => {
        sta.cartProducts = [];
        sta.isLoading = false;
      })
      .addCase(logout, (sta, act) => {
        sta.cartProducts = [];
      }).addCase(clearErrors, (sta) => {
        sta.error = ""
      })
      .addMatcher(
        isAnyOf(rejected, rejectedSignup, authRejected),
        (state, act) => {
          state.isLoading = false;
        },
      );
  },
});

export const {
  loadingCart,
  receiveCart,
  rejected: cartRejected,
  addProductCart,
  removeProductCart,
  payCart,
  addOperationText,
  cleanOperationText
} = cartReducer.actions;

export default cartReducer.reducer;
