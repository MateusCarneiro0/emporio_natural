import { createSlice } from "@reduxjs/toolkit";
import { idKey } from "../secretKeys";
import getLocalStorage from "../api/localStorageThunk";
const initialState = {
  authUser: "",
  authUserId: "",
  users: [],
  isLoading: false,
  isAuthenticated: false,
  authError: false,
  signupError: false,
  isLoadingGetStorage:false
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    receiveUsers(sta, act) {
      sta.users = act.payload;
      sta.isLoading = false;
      sta.error = "";
    },
    createNewUser(sta, action) {
      sta.authUserId = action.payload.id;
      sta.users = [...sta.users, { ...action.payload, id: sta.authUserId }];
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
      sta.authError = true;
    },
    rejectedSignup(sta, act) {
      sta.error = "";
      sta.isLoading = false;
      sta.signupError = act.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalStorage.pending, (state) => {
        state.isLoading = true;
        state.isLoadingGetStorage = true;
      })
      .addCase(getLocalStorage.fulfilled, (sta, action) => {
        if (action.payload !== null) {
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
      .addCase(getLocalStorage.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authUser = "";
        state.authUserId = "";
      });
  },
});

export const { logout,rejectedSignup,authRejected,rejected } = authReducer.actions;

export default authReducer.reducer;
