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
      sta.cartProducts = act.payload;
      sta.isLoading = false;
      sta.error = "";
    },
    rejected(sta, act) {
      sta.isLoading = false;
      sta.error = act.payload;
    },
    addProductCart(sta, act) {
      sta.cartProducts = [...sta.cartProducts, act.payload];
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
    if (cartProducts.some((cartProduct) => cartProduct.id === product.id))
      return;

    dispatch({ type: "cart/loadingCart" });
    try {
      await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [...cartProducts, product],
        }),
      });
      dispatch({
        type: "cart/receiveCart",
        payload: [...cartProducts, product],
      });
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: err.message });
    }
  };
}

export default cartReducer.reducer;
