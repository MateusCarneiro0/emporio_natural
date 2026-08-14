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

export async function getProduct({ params },acessToken) {
  const { id } = params;
  store.dispatch(resetError());

  try {
    const data = await requestJson(`products/${encodeURIComponent(id)}`, {
      method: "GET",
    },acessToken);
    const product = data?.at?.(0);
    if (product) {
      store.dispatch(receivedCurrentProduct(product));
      return data;
    } else {
      throw new Error("Produto não encontrado");
    }
  } catch (err) {
    store.dispatch(rejected(err.message));
    return { error: err.message };
  }
}
