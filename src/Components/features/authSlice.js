import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../NumberPhone";
const initialState = {
  authUser: "",
  password: "",
  authUserId: "",
  users: [],
  isLoading: false,
  isAuthenticated: false,
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
      sta.authUserId = crypto.randomUUID();
      sta.users = [...sta.users, { ...action.payload, id: sta.authUserId }];
      sta.authUser = action.payload.user;
      sta.password = action.payload.password;
      sta.isLoading = false;
      sta.error = "";
    },
    loginUser: {
      prepare(username, password) {
        return {
          payload: { username, password },
        };
      },
      reducer(sta, action) {
        const loggedUser = sta.users.find(
          (user) =>
            user.user === action.payload.username &&
            user.password === action.payload.password,
        );
        if (loggedUser.length) {
          sta.authUser = loggedUser.user;
          sta.password = loggedUser.password;
          sta.authUserId = loggedUser.id;
          sta.isLoading = false;
          sta.error = "";
        }
      },
    },
    loadingUsers(sta) {
      sta.isLoading = true;
    },
    rejected(sta, act) {
      sta.error = act.payload;
    },
    logout(sta) {
      sta.authUser = "";
      sta.password = "";
      sta.authUserId = "";
      sta.isAuthenticated = false;
      sta.error = "";
      sta.isLoading = false;
    },
  },
});

export const { logout, loginUser } = authReducer.actions;

export function receiveUsers() {
  return async (dispatch, getState) => {
    const { users } = getState().auth;
    if (!users.lenght) return;

    dispatch({ type: "auth/loadingUsers" });
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      dispatch({ type: "auth/receiveUsers", payload: data });
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}

export function createNewUser(user) {
  return async (dispatch, getState) => {
    dispatch({ type: "auth/loadingUsers" });
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      dispatch({ type: "auth/createNewUser", payload: data });
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}

/*export function loginUser(username, password) {
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
      }
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: err.message });
    }
  };
}*/
export default authReducer.reducer;
