import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../secretKeys";
import getLocalStorage from "./localStorageThunk";
const initialState = {
  authUser: "",
  authUserId: "",
  users: [],
  isLoading: false,
  isAuthenticated: false,
  authError: false,
  signupError: false,
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
      localStorage.setItem("id", JSON.stringify(action.payload.id));
    },
    loginUser(sta, action) {
      sta.authUser = action.payload.user;
      sta.authUserId = action.payload.id;
      sta.isLoading = false;
      sta.error = "";
      sta.authError = false;
      sta.isAuthenticated = true;
      localStorage.setItem("id", JSON.stringify(action.payload.id));
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
      localStorage.removeItem("id")
    },
    authRejected(sta) {
      sta.error = "";
      sta.isLoading = false;
      sta.authError = true;
    },
    rejectedSignup(sta) {
      sta.error = "";
      sta.isLoading = false;
      sta.signupError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLocalStorage.fulfilled, (sta, action) => {
        if (action.payload !== null) {
          sta.authUser = action.payload.user;
          sta.authUserId = action.payload.id;
          sta.isAuthenticated = true;
        }
        sta.isLoading = false;
        sta.error = "";
        sta.authError = false;
      })
      .addCase(getLocalStorage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout } = authReducer.actions;

export function receiveUsers() {
  return async (dispatch, getState) => {
    const { users } = getState().auth;
    if (!users.length) {
      dispatch({ type: "auth/loadingUsers" });
      try {
        const res = await fetch(`${BASE_URL}/users`);
        const data = await res.json();
        dispatch({ type: "auth/receiveUsers", payload: data });
      } catch (err) {
        dispatch({ type: "auth/rejected", payload: err.message });
      }
    }
  };
}

export function createNewUser(user) {
  return async (dispatch, getState) => {
    dispatch({ type: "auth/loadingUsers" });
    dispatch({ type: "cart/loadingCart" });
    try {
      const res = await fetch(`${BASE_URL}/users/createnewuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data?.error) {
        dispatch({ type: "auth/rejectedSignup" });
      } else {
        const { id, user: createdUser, cart } = data;
        const newUser = { id, user: createdUser };
        dispatch({ type: "auth/createNewUser", payload: newUser });
        dispatch({ type: "cart/receiveCart", payload: { cart } });
      }
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}

export function loginUser(username, password) {
  return async (dispatch, getState) => {
    dispatch({ type: "auth/loadingUsers" });
    try {
      const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();

      if (data.auth) {
        const { id, user, cart } = data;
        const loggedUser = { id, user };
        dispatch({ type: "auth/loginUser", payload: loggedUser });
        dispatch({ type: "cart/receiveCart", payload: cart });
      } else {
        dispatch({ type: "auth/authRejected" });
      }
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}
export default authReducer.reducer;
