import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";
import authReducer, { logout } from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import { createNewUser, loginUser } from "../api/authApi";

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
  const waitedState = {
    authUser: "",
    isLoading: false,
    isAuthenticated: false,
    authError: false,
    signupError: false,
    isLoadingGetStorage: true,
    error: "",
  };
  const username = `TEST_CART${Math.floor(Math.random() * 15000)}`;
  it("Testando se o estado inicial é correto", () => {
    const store = initializeStore();
    const authInitialState = store.getState().auth;

    expect(authInitialState).toEqual(waitedState);
  });

  it("Há uma criação correta de usuário", async () => {
    const store = initializeStore();

    await store.dispatch(
      createNewUser({
        user: username,
        password: "TEST_CART",
      }),
    );

    const authState = store.getState().auth;

    expect(authState.authUser).toBe(username);
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();
  }, 30000);
  it("Há um login correto de usuário", async () => {
    const store = initializeStore();
    await store.dispatch(loginUser(username, "TEST_CART"));
    const authState = store.getState().auth;

    expect(authState.authError).toBeFalsy()
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();
    expect(authState.authUser).toBe(username);
  });

  it("Retorna erro com credenciais erradas", async () => {
    const store = initializeStore();
    await store.dispatch(loginUser(username, "ERRORERRROR"));
    const authState = store.getState().auth;

    expect(authState.authUser).toBe("");
    expect(authState.isAuthenticated).toBeFalsy();
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();
    expect(authState.authError).toMatch(
      /Usuário ou senha não encontrados, tente novamente mais tarde/i,
    );
  });
  it("Retorna erro em tentar criar usuário já existente", async () => {
    const store = initializeStore();

    await store.dispatch(
      createNewUser({
        user: username,
        password: "TEST_CART",
      }),
    );

    const authState = store.getState().auth;

    expect(authState.authUser).toBe("");
    expect(authState.isAuthenticated).toBeFalsy();
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();
    expect(authState.signupError).toMatch(/Nome de usuário já criado/i);
  });

  it("Retorna erro com muitos caracteres no criar novo usuário", async () => {
    const store = initializeStore();

    await store.dispatch(
      createNewUser({
        user: "TEST_CART".repeat(16),
        password: "TEST_CART",
      }),
    );
    const authState = store.getState().auth;

    expect(authState.authUser).toBe("");
    expect(authState.isAuthenticated).toBeFalsy();
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();
    expect(authState.signupError).toMatch(
      /Muitos caracteres use no máximo 100/i,
    );
  });
  it("Retorna erro com muitos caracteres em um login de usuário", async () => {
    const store = initializeStore();
    
    await store.dispatch(loginUser("TEST_CART".repeat(16), "TEST_CART"));
    const authState = store.getState().auth;

    expect(authState.authUser).toBe("");
    expect(authState.isAuthenticated).toBeFalsy();
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();
    expect(authState.authError).toMatch(/Muitos caracteres use no máximo 100/i);
  });
  it("Testando se logout funciona", async () => {
    const store = initializeStore();
    const newUsername = `TEST_CART${Math.floor(Math.random() * 1000)}`;
    await store.dispatch(
      createNewUser({
        user: newUsername,
        password: "TEST_CART",
      }),
    );

    const authState = store.getState().auth;

    expect(authState.authUser).toBe(newUsername);
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.isLoading).toBeFalsy();
    expect(authState.isLoadingGetStorage).toBeFalsy();

    store.dispatch(logout());

    const authStateAfterLogout = store.getState().auth;

    expect(authStateAfterLogout).toEqual({...waitedState,isLoadingGetStorage:false});

    await store.dispatch(loginUser(newUsername, "TEST_CART"));
    const authStateAfterLogin = store.getState().auth;

    expect(authStateAfterLogin.authUser).toBe(newUsername);
    expect(authStateAfterLogin.isAuthenticated).toBe(true);
    expect(authStateAfterLogin.isLoading).toBeFalsy();
    expect(authStateAfterLogin.isLoadingGetStorage).toBeFalsy();
  });
});
