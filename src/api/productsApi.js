import requestJson from "./requestJson";

export function fetchProducts() {
  return async (dispatch, getState) => {
    dispatch({ type: "products/loadingProducts" });
    try {
      
      const data = await requestJson("/");
      dispatch({ type: "products/receiveProducts", payload: data });
    } catch (err) {
      dispatch({ type: "products/rejected", payload:"Error on fetch products" });
    }
  };
}

export function getProduct(id) {
  return async (dispatch, getState) => {
    dispatch({ type: "products/loadingProducts" });
    try {
      const data = await requestJson(`products/${id}`);
      
      dispatch({
        type: "products/receivedCurrentProduct",
        payload: data.at(0),
      });
    } catch {
      dispatch({ type: "products/rejected" });
    }
  };
}
