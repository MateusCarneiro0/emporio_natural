import requestJson from "./requestJson";

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