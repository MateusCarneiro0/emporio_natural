import { BASE_URL, idKey, refreshTokenKey } from "../secretKeys";
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
async function fetchRefresh() {
  const refresh_token = localStorage.getItem(refreshTokenKey);
  const headers = {
    Authorization: `Bearer ${refresh_token}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    headers,
  };
  const res = await fetch(`${BASE_URL}/refresh`, options);

  if (!res.ok) {
    throw new UnathouridedApiError("Erro ao se autenticar com o refresh token");
  }
  const data = await res.json();
  return data;
}

export default async function requestJson(url, options, bearerToken) {
  const acessToken = JSON.parse(localStorage.getItem(idKey));
  const optionsToken = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${bearerToken || acessToken}`,
    },
  };
  const res = await fetch(
    `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
    optionsToken,
  );
  if (!res.ok) {
    if (res.status === 401) {
      const error = await res.json();
      if (error?.type_error === "expired") {
        const { acess_token:new_acess_token, refresh_token } = await fetchRefresh();

        localStorage.setItem(idKey, JSON.stringify(new_acess_token));
        localStorage.setItem(refreshTokenKey, JSON.stringify(refresh_token));
        
        const newRes = await fetch(
          `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
          {...options,headers:{...options?.headers,Authentication:`Bearer ${new_acess_token}`}},
        );

        if(!res.ok){
          throw new UnathouridedApiError("Erro ao tentar se autenticar")
        }

        const data = newRes.json()
        return data
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
