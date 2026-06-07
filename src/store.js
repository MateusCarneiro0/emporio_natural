import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Components/features/authSlice";
import cartReducer from "./Components/features/cartSlice";
import productsSlice from "./Components/features/productsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products:productsSlice
  },
});

export default store
