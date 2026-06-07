import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";

const initialState = {
  displayProducts: [],
  isLoading: false,
  products: [],
  error: "",
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
    },
    searchProducts(sta, act) {
      const search = act.payload;

      sta.displayProducts = sta.products.filter(
        (product) =>
          product.nome.toLocaleLowerCase().includes(search) ||
          product.alias.toLocaleLowerCase().includes(search) ||
          product.categorias.some((cate) =>
            cate.toLocaleLowerCase().includes(search),
          ),
      );
    },
  },
});

export const { searchProducts } = productsSlice.actions;
export default productsSlice.reducer;

export function fetchProducts() {
  return async (dispatch, getState) => {
    dispatch({ type: "products/loadingProducts" });
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      dispatch({ type: "products/receiveProducts", payload: data });
    } catch {
      dispatch({ type: "products/rejected" });
    }
  };
}
