import { createSlice } from "@reduxjs/toolkit";
import { idKey } from "../../secretKeys";
import getLocalStorage from "./localStorageThunk";
import requestJson from "./requestJson";
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
    authRejected(sta) {
      sta.error = "";
      sta.isLoading = false;
      sta.authError = true;
    },
    rejectedSignup(sta, act) {
      sta.error = "";
      sta.isLoading = false;
      sta.signupError = act.payload.manyCharacters
        ? "Many characters use less characters(100 in total)"
        : "User is has repeated";
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
        } else {
          sta.isAuthenticated = false;
          sta.authUser = "";
          sta.authUserId = "";
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

export function createNewUser(user) {
  return async (dispatch, getState) => {
    dispatch({ type: "auth/loadingUsers" });
    dispatch({ type: "cart/loadingCart" });
    try {
      const data = await requestJson(`users/createnewuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!user?.user || !user?.password) {
        throw new Error("username or password is not identificated");
      }

      if (data?.hasRepeated) {
        dispatch({
          type: "auth/rejectedSignup",
          payload: { hasRepeated: true },
        });
      } else if (user.user.length > 100 || user.password.length > 100 || data?.manyCharacters) {
        dispatch({
          type: "auth/rejectedSignup",
          payload: { manyCharacters: true },
        });
      } else {
        const { id, user: createdUser, cart } = data;
        const newUser = { id, user: createdUser };
        dispatch({ type: "auth/createNewUser", payload: newUser });
        dispatch({ type: "cart/receiveCart", payload: { cart } });
      }
    } catch (err) {
      if (err.name === "FetchApiError") {
        dispatch({
          type: "auth/rejected",
          payload: "Erro when create user in server",
        });
      } else {
        dispatch({
          type: "auth/rejected",
          payload: err.message,
        });
      }
    }
  };
}

export function loginUser(username, password) {
  return async (dispatch, getState) => {
    dispatch({ type: "auth/loadingUsers" });
    try {
      const data = await requestJson(`users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (data.auth) {
        const { id, user, cart } = data;
        const loggedUser = { id, user };
        dispatch({ type: "auth/loginUser", payload: loggedUser });
        dispatch({ type: "cart/receiveCart", payload: cart });

      } else {
        dispatch({ type: "auth/authRejected" });
      }
    } catch (err) {
      dispatch({ type: "auth/rejected", payload: "Error when login user in server try later"});
    }
  };
}
export default authReducer.reducer;