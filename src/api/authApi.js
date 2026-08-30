import {
  loadingUsers,
  rejectedSignup,
  loginUser as loginUserAction,
  authRejected,
  createNewUser as createNewUserAction,
  logout,
} from "../slices/authSlice";
import { receiveCart } from "../slices/cartSlice";
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
        const { user: createdUser, cart } = data;
        if (createdUser && Array.isArray(cart)) {
          const newUser = { user: createdUser };
          dispatch(createNewUserAction(newUser));

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
    try {
      if (!username || !password) {
        throw new EnoughDataError(
          "Campos de usuário ou de senha nulos preencha-os",
        );
      }
      const data = await requestJson(`users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (data.auth) {
        const { user, cart } = data;
        if (Array.isArray(cart) && user) {
          dispatch(loginUserAction(user));
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
          authRejected(
            "Usuário ou senha não encontrados, tente novamente mais tarde",
          ),
        );
      }
    } catch (err) {
      dispatch(authRejected(err.message));
    }
  };
}

export function logoutApi() {
  return async (dispatch) => {
    dispatch(loadingUsers());
    try {
      const data = await requestJson(`users/logout`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if(data?.status === "correct"){
        throw new Error("Erro em fazer logout")
      }
    } catch (err) {
      dispatch(authRejected("Error in logout"));
    } finally {
      dispatch(logout());
    }
  };
}
