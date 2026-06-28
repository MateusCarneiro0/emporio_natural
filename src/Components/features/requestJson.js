import { BASE_URL } from "../../secretKeys";
export class FetchApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "FetchApiError";
    this.message = message;
    this.status = status;
  }
}
export default async function requestJson(url, options) {
  const res = await fetch(`${BASE_URL}/${url}`, options);
  if (!res.ok) {
    throw new FetchApiError("A error ocurred in response", res.status);
  }
  const data = await res.json().catch(() => {
    throw new FetchApiError("A error ocurred in response", res.status);
  });
  return data;
}
