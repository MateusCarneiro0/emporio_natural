import {
  loadingCurrentProduct,
  loadingProducts,
  receivedCurrentProduct,
  receiveProducts,
  rejected,
} from "../slices/productsSlice";
import requestJson from "./requestJson";

export function fetchProducts() {
  return async (dispatch, getState) => {
    dispatch(loadingProducts());
    try {
      const data = await requestJson("");
      dispatch(receiveProducts(data));
    } catch (err) {
      dispatch(
        rejected("Erro em buscar os produtos, tente novamente mais tarde."),
      );
    }
  };
}

export function getProduct(id) {
  return async (dispatch, getState) => {
    dispatch(loadingCurrentProduct());
    try {
      const data = await requestJson(`products/${encodeURIComponent(id)}`);
      const product = data?.at?.(0);
      if (product) {
        dispatch(receivedCurrentProduct(product));
      } else {
        throw new Error("Produto não encontrado");
      }
    } catch (err) {
      dispatch(rejected(err.message));
    }
  };
}
