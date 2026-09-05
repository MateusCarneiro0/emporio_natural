import { createSlice } from "@reduxjs/toolkit";
import getLocalStorage from "../api/localStorageThunk";

const initialState = {
  authUser: "",
  isLoading: false,
  isAuthenticated: false,
  authError: false,
  signupError: false,
  isLoadingGetStorage: true,
  error: "",
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    createNewUser(sta, action) {
      sta.authUser = action.payload.user;
      sta.isLoading = false;
      sta.error = "";
      sta.isAuthenticated = true;
      sta.signupError = false;
      sta.isLoadingGetStorage = false;
    },
    loginUser(sta, action) {
      sta.authUser = action.payload.user;
      sta.isLoading = false;
      sta.error = "";
      sta.authError = false;
      sta.isAuthenticated = true;
      sta.isLoadingGetStorage = false;
    },
    loadingUsers(sta) {
      sta.isLoading = true;
      sta.error = "";
      sta.authError = false;
      sta.signupError = false;
    },
    rejected(sta, act) {
      sta.error = act.payload;
      sta.authError = "";
      sta.isLoadingGetStorage = false;
      sta.isLoading = false;
    },
    logout(sta) {
      sta.authUser = "";
      sta.isAuthenticated = false;
      sta.error = "";
      sta.isLoading = false;
      sta.authError = false;
    },
    authRejected(sta, act) {
      sta.authError = act?.payload
        ? act.payload
        : "Usuário ou senha não encontrados tente novamente";
      sta.isLoading = false;
      sta.isLoadingGetStorage = false;
    },
    rejectedSignup(sta, act) {
      sta.error = "";
      sta.isLoading = false;
      sta.signupError = act.payload;
      sta.isLoadingGetStorage = false;
    },
    clearErrors(sta) {
      sta.error = "";
      sta.signupError = "";
      sta.authError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalStorage.pending, (state) => {
        state.isLoading = true;
        state.isLoadingGetStorage = true;
      })
      .addCase(getLocalStorage.fulfilled, (sta, action) => {
        if (action.payload !== null && action?.payload?.user) {
          sta.authUser = action.payload.user;
          sta.isAuthenticated = true;
        } else {
          sta.isAuthenticated = false;
          sta.authUser = "";
        }
        sta.isLoadingGetStorage = false;
        sta.isLoading = false;
        sta.error = "";
        sta.authError = false;
      })
      .addCase(getLocalStorage.rejected, (state) => {
        state.isLoadingGetStorage = false;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authUser = "";
      });
  },
});

export const {
  logout,
  rejectedSignup,
  authRejected,
  rejected,
  createNewUser,
  loginUser,
  loadingUsers,
  clearErrors,
} = authReducer.actions;

export default authReducer.reducer;
