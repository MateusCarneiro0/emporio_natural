import { createSlice } from "@reduxjs/toolkit";
import getLocalStorage from "./localStorageThunk";
import requestJson from "./requestJson";

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
        : [act.apyload];
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

export function fetchCart() {
  return async (dispatch, getState) => {
    dispatch({ type: "cart/loadingCart" });
    const { authUserId: userId } = getState().auth;
    try {
      const data = await requestJson(`users/${userId}`);
      console.log(data)
      dispatch({
        type: "cart/receiveCart",
        payload: { cart: data.cart, userId },
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: err.name });
    }
  };
}

export function addProductCart(product) {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;
    dispatch({ type: "cart/loadingCart" });
    try {
      await requestJson(`users/${userId}/addproductcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });
      dispatch({
        type: "cart/addProductCart",
        payload: product,
      });
    } catch (err) {
      if (err.name === "FetchApiError") {
        dispatch({ type: "cart/rejected", payload: err.message + "FETCH" });
      } else {
        dispatch({ type: "cart/rejected", payload: err.message });
      }
    }
  };
}

export function deleteProductCart(productId) {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;
    dispatch({ type: "cart/loadingCart" });
    try {
      await requestJson(`users/${userId}/removeProductCart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });
      dispatch({
        type: "cart/removeProductCart",
        payload: productId,
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: "Error on delete product" });
    }
  };
}

export function payCart() {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;
    dispatch({ type: "cart/loadingCart" });
    try {
      await requestJson(`users/${userId}/clearCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [],
        }),
      });
      dispatch({
        type: "cart/payCart",
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: "Error on pay cart" });
    }
  };
}
export default cartReducer.reducer;
