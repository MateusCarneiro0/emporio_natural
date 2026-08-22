import { BASE_URL, idKey } from "../secretKeys";
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
function fetchRefresh(options){
  const res = fetch(`${BASE_URL}/refresh`,{

  })
}
export default async function requestJson(url, options,bearerToken) {
  const acessToken = JSON.parse(localStorage.getItem(idKey));
  const optionsToken = {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${bearerToken || acessToken}` },
  };
  const res = await fetch(
    `${BASE_URL}/${String(url).replace(/^\/+/, "")}`,
    optionsToken,
  );
  if (!res.ok) {
    if(res.status === 401){
      const error = await res.json()
      if(error?.type_error === "expired"){
        const refresh = await fetchRefresh()
      }else{
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
