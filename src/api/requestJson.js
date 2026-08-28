import { BASE_URL} from "../secretKeys";
import { logout, authRejected } from "../slices/authSlice";
export class FetchApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "FetchApiError";
    this.message = message;
    this.status = status;
  }
}
export class UnathouridedApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "UnathouridedApiError";
    this.message = message;
    this.status = status;
  }
}

async function returnToTheLogin() {
  const store = await import ("../app/store")
  store.dispatch(logout());
  store.dispatch(
    authRejected("Houve um erro! E você terá que revalidar sua identidade"),
  );
}

async function fetchRefresh() {
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    headers,
    credentials: "include",
  };
  const res = await fetch(`${BASE_URL}/refresh`, options);

  const data = await res.json();
  return data;
}

export default async function requestJson(url, options, bearerToken) {
  const optionsToken = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${bearerToken}`,
    },
    credentials: "include",
  };
  const res = await fetch(
    `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
    optionsToken,
  );
  if (!res.ok) {
    if (res.status === 401 || res.status === 422) {
      const error = await res.json();
      if (error?.type_error === "expired") {
        const newData = await fetchRefresh();

        const newRes = await fetch(
          `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
          {
            ...options,
            headers: {
              ...options?.headers,
            },
          },
        );

        if (!newRes.ok || !newData?.status === "refreshed") {
          returnToTheLogin();
          throw new UnathouridedApiError("Erro ao tentar se autenticar");
        }

        const data = newRes.json();
        return data;
      } else {
        throw new UnathouridedApiError(
          "Usuário inválido por token errado",
          res.status,
        );
      }
    }
    if (res.status === 422) {
      throw new UnathouridedApiError(
        "Usuário inválido por token errado",
        res.status,
      );
    }
    throw new FetchApiError(
      "Houve um erro na procura de dados, tente novamente",
      res.status,
    );
  }
  const data = await res.json().catch(() => {
    throw new FetchApiError(
      "Houve um erro na procura de dados, tente novamente",
      res.status,
    );
  });
  return data;
}
