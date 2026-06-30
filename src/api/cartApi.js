import requestJson from "./requestJson";

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