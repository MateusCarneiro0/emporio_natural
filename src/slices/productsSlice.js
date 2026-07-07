import { createSlice } from "@reduxjs/toolkit";
import { verifyProduct } from "../utils/ProductChecker";
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
      sta.error = action?.payload || "Error in fetch product";
      sta.isLoading = false;
    },
    receiveProducts(sta, act) {
      sta.products = act.payload.filter((product) => verifyProduct(product));
      sta.displayProducts = sta.products;
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
    leaveOfCurrentProduct(sta){
      sta.currentProduct = {}
    }
  },
});

export const { searchProducts, leaveOfCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;