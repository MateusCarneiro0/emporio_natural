import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";
const initialState = {
  authUser: "",
  password: "",
  authUserId: "",
  users: [],
  isLoading: false,
  isAuthenticated: false,
  authError: false,
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
      sta.password = action.payload.password;
      sta.isLoading = false;
      sta.error = "";
      sta.isAuthenticated = true;
    },
    loginUser(sta, action) {
      sta.authUser = action.payload.user;
      sta.password = action.payload.password;
      sta.authUserId = action.payload.id;
      sta.isLoading = false;
      sta.error = "";
      sta.authError = false;
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
      sta.password = "";
      sta.authUserId = "";
      sta.isAuthenticated = false;
      sta.error = "";
      sta.isLoading = false;
      sta.authError = false;
    },
    authRejected(sta) {
      sta.error = "";
      sta.isLoading = false;
      sta.authError = true;
    },
  },
});

export const { logout } = authReducer.actions;

export function receiveUsers() {
  return async (dispatch, getState) => {
    const { users } = getState().auth;
    console.log(users, !users.length === 0);
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
    const uuid = crypto.randomUUID();
    const id = uuid.replace(/\D/g, "");
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, cart: [], id }),
      });
      const data = await res.json();
      dispatch({ type: "auth/createNewUser", payload: data });
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}

export function loginUser(username, password) {
  return async (dispatch, getState) => {
    dispatch({ type: "auth/loadingUsers" });
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      const loggedUser = data.find(
        (user) => user.user === username && user.password === password,
      );
      if (loggedUser.length) {
        dispatch({
          type: "auth/loginUser",
          payload: {
            user: loggedUser.user,
            password: loggedUser.password,
            id: loggedUser.id,
          },
        });
      } else {
        dispatch({ type: "auth/authRejected" });
      }
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}
export default authReducer.reducer;
