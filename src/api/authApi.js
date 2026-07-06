import requestJson from "./requestJson";
class EnoughDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnoughDataError";
  }
}
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
        throw new EnoughDataError(
          "Campos de usuário ou de senha nulos preencha-os",
        );
      }

      if (data?.hasRepeated) {
        dispatch({
          type: "auth/rejectedSignup",
          payload: "Nome de usuário já criado",
        });
      } else if (
        user.user.length > 100 ||
        user.password.length > 100 ||
        data?.manyCharacters
      ) {
        dispatch({
          type: "auth/rejectedSignup",
          payload: "Muitos caracteres use no máximo 100 caracteres",
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
          payload: "Erro em criar usuário tente novamente mais tarde",
        });
      } else if (err.name === "EnoughDataError") {
        dispatch({ type: "auth/rejectedSignup", payload: err.message });
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
    if (!username || !password) {
      throw new EnoughDataError(
        "Campos de usuário ou de senha nulos preencha-os",
      );
    }
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
        if (Array.isArray(cart) && id && user) {
          const loggedUser = { id, user };
          dispatch({ type: "auth/loginUser", payload: loggedUser });
          dispatch({ type: "cart/receiveCart", payload: cart });
        } else {
          throw new Error("Erro em encontrar um carrinho no servidor tente novamente mais tarde");
        }
      } else {
        dispatch({ type: "auth/authRejected" });
      }
    } catch (err) {
      if (err.name === "EnoughDataError") {
        dispatch({
          type: "auth/authRejected",
          payload: err.message,
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
