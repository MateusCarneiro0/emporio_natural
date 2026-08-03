import {
  loadingUsers,
  rejected,
  rejectedSignup,
  loginUser as loginUserAction,
  authRejected,
} from "../slices/authSlice";
import { loadingCart, receiveCart } from "../slices/cartSlice";
import requestJson, { FetchApiError } from "./requestJson";
class EnoughDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnoughDataError";
  }
}
export function createNewUser(user) {
  return async (dispatch, getState) => {
    dispatch(loadingUsers());
    dispatch(loadingCart());
    try {
      if (!user?.user || !user?.password) {
        throw new EnoughDataError(
          "Campos de usuário ou de senha nulos preencha-os",
        );
      }
      const data = await requestJson(`users/createnewuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (data?.hasRepeated) {
        dispatch(rejectedSignup("Nome de usuário já criado"));
      } else if (
        user.user.length > 100 ||
        user.password.length > 100 ||
        data?.manyCharacters
      ) {
        dispatch(rejectedSignup("Muitos caracteres use no máximo 100"));
      } else {
        const { id, user: createdUser, cart } = data;
        if (id && createdUser && Array.isArray(cart)) {
          const newUser = { id, user: createdUser };
          dispatch(createNewUser(newUser));

          dispatch(receiveCart(cart));
        } else {
          throw new FetchApiError("Erro em criar usuário");
        }
      }
    } catch (err) {
      if (err.name === "FetchApiError") {
        dispatch(
          rejectedSignup("Erro em criar usuário tente novamente mais tarde"),
        );
      } else if (err.name === "EnoughDataError") {
        dispatch(rejectedSignup(err.message));
      } else {
        dispatch(rejectedSignup(err.message));
      }
    }
  };
}

export function loginUser(username, password) {
  return async (dispatch, getState) => {
    dispatch(loadingUsers());
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
          dispatch(loginUserAction(loggedUser));
          dispatch(receiveCart(cart));
        } else {
          throw new Error(
            "Erro em encontrar um carrinho no servidor tente novamente mais tarde",
          );
        }
      } else {
        if (data?.error) {
          dispatch(
            authRejected("Erro em fazer validação,tente novamente mais tarde"),
          );
        }
        dispatch(
          authRejected("Usuário ou senha não encontrados, tente novamente mais tarde"),
        );
      }
    } catch (err) {
      dispatch(authRejected(err.message));
    }
  };
}
