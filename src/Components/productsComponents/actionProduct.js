import requestJson from "../../api/requestJson";
import store from "../../app/store";
import {
  receivedCurrentProduct,
  receiveProducts,
  rejected,
  resetError,
} from "../../slices/productsSlice";

export async function fetchProducts() {
  store.dispatch(resetError());

  try {
    const data = await requestJson("", { method: "GET" });
    store.dispatch(receiveProducts(data));
    return data;
  } catch (err) {
    store.dispatch(
      rejected("Erro em buscar os produtos, tente novamente mais tarde."),
    );
    return { error: err.message };
  }
}

export async function getProduct({ params },bearerToken) {
  const { id } = params;
  store.dispatch(resetError());

  try {
    const product = await requestJson(`products/${encodeURIComponent(id)}`, {
      method: "GET",
    },bearerToken);
    
    if (product) {
      store.dispatch(receivedCurrentProduct(product));
      return product;
    } else {
      throw new Error("Produto não encontrado");
    }
  } catch (err) {
    store.dispatch(rejected(err.message));
    return { error: err.message };
  }
}
