import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Components/features/authSlice";
import cartReducer from "./Components/features/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store
