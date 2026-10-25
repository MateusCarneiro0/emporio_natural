const BASE_URL = import.meta.env?.VITE_API_URL || process.env.VITE_API_URL;
const NUMBER_PHONE =
  import.meta.env?.VITE_NUMBER_PHONE || process.env.VITE_NUMBER_PHONE || "8888888888"
const ISDEV = ((import.meta?.env?.VITE_DEV || process.env.VITE_DEV) === "true") || "true"
export { BASE_URL, NUMBER_PHONE, ISDEV };
