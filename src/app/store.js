import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import productsSlice from "../slices/productsSlice";
import globalSlice from "../slices/globalSlice"
import { ISDEV } from "../secretKeys";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsSlice,
    global:globalSlice
  },
});

if(ISDEV){
  window.__STORE__ = store
}

export default store;
