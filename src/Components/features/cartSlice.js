import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";

const initialState = {
  cartProducts: [],
  isLoading: false,
  error: "",
  userId: "idiffififffid",
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
      sta.userId = act.payload.userId;
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

export function fetchCart(userId) {
  return async (dispatch, getState) => {
    dispatch({ type: "cart/loadingCart" });
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
    const { userId, cartProducts } = getState().cart;
    const products = cartProducts.some(
      (cartProduct) => cartProduct.id === product.id,
    )
      ? cartProducts.map((cartProduct) =>
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
    const { userId, cartProducts } = getState().cart;
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
        type: "cart/receiveCart",
        payload: products,
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: err.message });
    }
  };
}
export function payCart() {
  return async (dispatch, getState) => {
    const { userId } = getState().cart;
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
