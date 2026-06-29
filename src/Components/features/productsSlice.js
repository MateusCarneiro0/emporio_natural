import { createSlice } from "@reduxjs/toolkit";
import requestJson from "./requestJson";

const initialState = {
  displayProducts: [],
  isLoading: false,
  products: [],
  error: "",
  currentProduct: {},
  times: 0,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    loadingProducts(state, act) {
      state.isLoading = true;
    },
    rejected(sta, action) {
      sta.error = "Error in fetch products try later";
      sta.isLoading = false;
    },
    receiveProducts(sta, act) {
      sta.displayProducts = act.payload;
      sta.products = act.payload;
      sta.isLoading = false;
      sta.error = "";
    },
    searchProducts(sta, act) {
      const search = act.payload.toLocaleLowerCase();

      sta.displayProducts = sta.products.filter(
        (product) =>
          product.nome.toLocaleLowerCase().includes(search) ||
          product.alias.toLocaleLowerCase().includes(search) ||
          product.categorias.some((cate) =>
            cate.toLocaleLowerCase().includes(search),
          ),
      );
    },
    receivedCurrentProduct(sta, act) {
      sta.isLoading = false;
      sta.currentProduct = act.payload;
      sta.error = "";
    },
  },
});

export const { searchProducts } = productsSlice.actions;
export default productsSlice.reducer;

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
