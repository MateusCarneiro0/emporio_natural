import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";

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
      sta.cartProducts = act.payload.cart;
      sta.isLoading = false;
      sta.error = "";
    },
    rejected(sta, act) {
      sta.isLoading = false;
      sta.error = act.payload;
    },
    addProductCart(sta, act) {
      sta.cartProducts = act.payload;
      sta.isLoading = false;
      sta.error = "";
    },
    payCart(sta, act) {
      sta.cartProducts = [];
      sta.isLoading = false;
      sta.error = "";
    },
  },
});

export function fetchCart() {
  return async (dispatch, getState) => {
    dispatch({ type: "cart/loadingCart" });
    const { authUserId: userId } = getState().auth;
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await res.json();
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
    const { cartProducts } = getState().cart;
    const { authUserId: userId } = getState().auth;
    const products = cartProducts?.some(
      (cartProduct) => cartProduct?.id === product.id,
    )
      ? cartProducts?.map((cartProduct) =>
          cartProduct.id === product.id ? product : cartProduct,
        )
      : [...cartProducts, product];

    dispatch({ type: "cart/loadingCart" });
    try {
      await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: products,
        }),
      });
      dispatch({
        type: "cart/addProductCart",
        payload: products,
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: err.message });
    }
  };
}

export function deleteProductCart(productId) {
  return async (dispatch, getState) => {
    const { cartProducts } = getState().cart;
    const {authUserId:userId} = getState().auth
    const products = cartProducts.filter(
      (cartProduct) => cartProduct.id !== productId,
    );
    dispatch({ type: "cart/loadingCart" });
    try {
      await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: products,
        }),
      });
      dispatch({
        type: "cart/addProductCart",
        payload: products,
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: err.message });
    }
  };
}
export function payCart() {
  return async (dispatch, getState) => {
    const { userId } = getState().auth;
    dispatch({ type: "cart/loadingCart" });
    try {
      await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
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
      dispatch({ type: "cart/rejected", payload: err.message });
    }
  };
}
export default cartReducer.reducer;
