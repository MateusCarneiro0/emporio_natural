import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import { createNewUser } from "../api/authApi";

const initializeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
  });
  return store;
};
describe("Testando os slices do auth", () => {
  it("Testando se o estado inicial é correto", () => {
    const store = initializeStore();
    const authInitialState = store.getState().auth;
    const waitedState = {
      authUser: "",
      isLoading: false,
      isAuthenticated: false,
      authError: false,
      signupError: false,
      isLoadingGetStorage: true,
      error: "",
    };
    expect(authInitialState).toEqual(waitedState);
  });

  it("Há uma criação correta de usuário", async () => {
    const store = initializeStore();
    const username = `TEST_CART${Math.floor(Math.random() * 1500)}`
    await store.dispatch(
      createNewUser({
        user: username,
        password: "TEST_CART",
      }),
    );

    const authState = store.getState().auth
    expect(authState.authUser).toBe(username)
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.isLoading).toBeFalsy()
    expect(authState.isLoadingGetStorage).toBeFalsy()

  },30000);
});
