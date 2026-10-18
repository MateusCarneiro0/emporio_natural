import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import productsSlice from "../slices/productsSlice";
import globalSlice from "../slices/globalSlice";
import appApi from "../api/appApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsSlice,
    global: globalSlice,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware:(gDF) => gDF().concat(appApi.middleware)
});

export default store;
