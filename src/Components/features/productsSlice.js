import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../secretKeys";

const initialState = {
  displayProducts: [],
  isLoading: false,
  products: [],
  error: "",
  currentProduct: {},
  times:0
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
      const res = await fetch(`${BASE_URL}`);
      const data = await res.json();
      dispatch({ type: "products/receiveProducts", payload: data });
    } catch {
      dispatch({ type: "products/rejected" });
    }
  };
}

export function getProduct(id) {
  return async (dispatch, getState) => {
    dispatch({ type: "products/loadingProducts" });
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      const data = await res.json();
      dispatch({ type: "products/receivedCurrentProduct", payload: data.at(0) });
    } catch {
      dispatch({ type: "products/rejected" });
    }
  };
}
