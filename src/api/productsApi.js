import requestJson from "./requestJson";

export function fetchProducts() {
  return async (dispatch, getState) => {
    dispatch({ type: "products/loadingProducts" });
    try {
      const data = await requestJson("/");
      dispatch({ type: "products/receiveProducts", payload: data });
    } catch (err) {
      dispatch({
        type: "products/rejected",
        payload: "Error on fetch products",
      });
    }
  };
}

export function getProduct(id) {
  return async (dispatch, getState) => {
    dispatch({ type: "products/loadingProducts" });
    try {
      const data = await requestJson(`products/${id}`);
      const product = data?.at?.(0);
      if (product) {
        dispatch({
          type: "products/receivedCurrentProduct",
          payload: product,
        });
      } else {
        throw new Error("Produto não encontrado");
      }
    } catch (err) {
      dispatch({ type: "products/rejected", payload: err.message });
    }
  };
}
