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
  console.log(refresh_token)
  const headers = {
    Authorization: `Bearer ${refresh_token}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    headers,
    credentials:true
  };
  const res = await fetch(`${BASE_URL}/refresh`, options);

  
  const data = await res.json();
  return data;
}

export default async function requestJson(url, options, bearerToken) {
  const acessToken = localStorage.getItem(idKey);
  const optionsToken = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${bearerToken || acessToken}`,
    },
    credentials:true
  };
  const res = await fetch(
    `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
    optionsToken,
  );
  if (!res.ok) {
    if (res.status === 401 || res.status === 422) {
      const error = await res.json();
      if (error?.type_error === "expired") {
        const {acess_token,refresh_token} = await fetchRefresh();
        localStorage.setItem(idKey, acess_token);
        localStorage.setItem(refreshTokenKey, refresh_token);

        const newRes = await fetch(
          `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
          {...options,headers:{...options?.headers,Authorization:`Bearer ${acess_token}`}},
        );

        if(!newRes.ok){
          localStorage.removeItem(refreshTokenKey)
          localStorage.removeItem(idKey)
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
