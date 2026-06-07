import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";

const initialState = {
  cartProducts: [],
  isLoading: false,
  error: "",
  userId: "",
};

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadingCart(sta, act) {
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
      sta.error = "Error";
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
    } catch {
      dispatch({ type: "cart/rejected" });
    }
  };
}
export function addProductCart(product) {
  return async (dispatch, getState) => {
    const { userId, cartProducts } = getState().cart;
    dispatch({ type: "cart/loadingCart" });
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Junta o anterior e o novo em uma única lista
          cart: [...cartProducts, product],
        }),
      });
      const data = await res.json();
      dispatch({ type: "cart/receiveCart", payload: data.cart });
    } catch {
      dispatch({ type: "cart/rejected" });
    }
  };
}

export default cartReducer.reducer;
