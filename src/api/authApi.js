import {
  loadingUsers,
  loginUser as loginUserAction,
  createNewUser as createNewUserAction,
  logout,
} from "../slices/authSlice";
import { receiveCart } from "../slices/cartSlice";
import { createToast } from "../utils/createToast";
import requestJson, { FetchApiError } from "./requestJson";

class EnoughDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnoughDataError";
  }
}

export function createNewUser(user) {
  return async (dispatch) => {
    dispatch(loadingUsers());

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
      throw new Error("Nome de usuário já criado");
    } else if (
      user.user.length > 100 ||
      user.password.length > 100 ||
      data?.manyCharacters
    ) {
      throw new Error("Muitos caracteres use no máximo 100");
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
  };
}

export function loginUser(username, password) {
  return async (dispatch) => {
    dispatch(loadingUsers());

    if (!username || !password) {
      throw new EnoughDataError(
        "Campos de usuário ou de senha nulos preencha-os",
      );
    }
    if (username.length >= 100 || password.length >= 100) {
      throw new Error("Muitos caracteres use no máximo 100");
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
        throw new Error("Erro em fazer validação,tente novamente mais tarde");
      }

      throw new Error(
        "Usuário ou senha não encontrados, tente novamente mais tarde",
      );
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
      if (data?.status !== "error") {
        dispatch(logout());
        createToast("Você saiu de sua conta!", true, "logout", 5000);
      }
    } catch {
      createToast(
        "Não dá para sair de sua conta! Tente novamente",
        false,
        "logout",
        7000,
      );
    }
  };
}
