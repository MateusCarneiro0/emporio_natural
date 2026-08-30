import { createSlice } from "@reduxjs/toolkit";
import { verifyProduct } from "../utils/ProductChecker";
import { clearErrors } from "./authSlice";
const initialState = {
  displayProducts: [],
  products: [],
  error: "",
  currentProduct: {},
  isLoadingCurrentProduct:false
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetError(sta){
      sta.error= ""
    },
    rejected(sta, action) {
      sta.error = action?.payload || "Erro em buscar produto";
      sta.isLoading = false;
    },
    loadingCurrentProductAdd(sta){
      sta.isLoadingCurrentProduct = true
    },
    loadingCurrentProduct(sta){
      sta.isLoadingCurrentProduct = true
      sta.error = ""
      sta.currentProduct = {}
    },
    receiveProducts(sta, act) {
      sta.products = act.payload.filter((product) => verifyProduct(product));
      sta.displayProducts = sta.products;
      sta.isLoading = false;
      sta.error = "";
      sta.isLoadingCurrentProduct = false
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
      sta.isLoadingCurrentProduct = false;
      sta.currentProduct = act.payload;
      sta.error = "";
    },
    leaveOfCurrentProduct(sta) {
      sta.currentProduct = {};
      sta.error = "";
      sta.isLoadingCurrentProduct = false
    },
    isNotLoading(sta){
      sta.isLoadingCurrentProduct = false
    }
  },
  extraReducers:(builder) => {
    builder.addCase(clearErrors, (state) => {
      state.error = ""
    })
  }
});

export const {
  searchProducts,
  leaveOfCurrentProduct,
  loadingCurrentProduct,
  loadingProducts,
  rejected,
  receiveProducts,
  receivedCurrentProduct,
  resetError,
  loadingCurrentProductAdd,
  isNotLoading
} = productsSlice.actions;
export default productsSlice.reducer;
