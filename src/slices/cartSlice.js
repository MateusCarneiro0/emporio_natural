import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import getLocalStorage from "../api/localStorageThunk";
import {
  authRejected,
  logout,
  rejected,
  rejectedSignup,
  clearErrors,
} from "./authSlice";
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
      const lenghtCartProducts = sta.cartProducts.length;
      sta.cartProducts = sta.cartProducts.filter(
        (product) => product.id !== act.payload,
      );
      if (sta.cartProducts.length < lenghtCartProducts) {
        sta.error = "";
      } else {
        sta.error = "Erro em remover produto";
      }
      sta.isLoading = false;
    },

    payCart(sta) {
      if (sta.cartProducts.length) {
        sta.cartProducts = [];
        sta.isLoading = false;
        sta.error = "";
      } else {
        sta.error = "Não há produtos no carrinho para serem pagos";
        sta.isLoading = false;
      }
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
      })
      .addCase(clearErrors, (sta) => {
        sta.error = "";
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
  cleanOperationText,
} = cartReducer.actions;

export default cartReducer.reducer;
