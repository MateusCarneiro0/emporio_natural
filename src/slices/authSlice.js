import { createSlice } from "@reduxjs/toolkit";
import { idKey } from "../secretKeys";
import getLocalStorage from "../api/localStorageThunk";

const initialState = {
  authUser: "",
  authUserId: "",
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
      sta.authUserId = action.payload.id;
      sta.authUser = action.payload.user;
      sta.isLoading = false;
      sta.error = "";
      sta.isAuthenticated = true;
      sta.signupError = false;
      localStorage.setItem(idKey, JSON.stringify(action.payload.id));
    },
    loginUser(sta, action) {
      sta.authUser = action.payload.user;
      sta.authUserId = action.payload.id;
      sta.isLoading = false;
      sta.error = "";
      sta.authError = false;
      sta.isAuthenticated = true;
      localStorage.setItem(idKey, JSON.stringify(action.payload.id));
    },
    loadingUsers(sta) {
      sta.isLoading = true;
      sta.error = ""
      sta.authError = false
      sta.signupError = false
    },
    rejected(sta, act) {
      sta.error = act.payload;
      sta.authError = false;
    },
    logout(sta) {
      sta.authUser = "";
      sta.authUserId = "";
      sta.isAuthenticated = false;
      sta.error = "";
      sta.isLoading = false;
      sta.authError = false;
      localStorage.removeItem(idKey);
    },
    authRejected(sta, act) {
      sta.authError = act?.payload
        ? act.payload
        : "Usuário ou senha não encontrados tente novamente";
      sta.isLoading = false;
    },
    rejectedSignup(sta, act) {
      sta.error = "";
      sta.isLoading = false;
      sta.signupError = act.payload;
    },
    clearErrors(sta){
      sta.error = ""
      sta.signupError = ""
      sta.authError = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalStorage.pending, (state) => {
        state.isLoading = true;
        state.isLoadingGetStorage = true;
      })
      .addCase(getLocalStorage.fulfilled, (sta, action) => {
        if (
          action.payload !== null &&
          action?.payload?.user &&
          action?.payload?.id
        ) {
          sta.authUser = action.payload.user;
          sta.authUserId = action.payload.id;
          sta.isAuthenticated = true;
        } else {
          sta.isAuthenticated = false;
          sta.authUser = "";
          sta.authUserId = "";
        }
        sta.isLoadingGetStorage = false;
        sta.isLoading = false;
        sta.error = "";
        sta.authError = false;
      })
      .addCase(getLocalStorage.rejected, (state,act) => {
        state.isLoadingGetStorage = false;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authUser = "";
        state.authUserId = "";
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
  clearErrors
} = authReducer.actions;

export default authReducer.reducer;
