export const BACKEND_URL =
  window.__cdm_env?.BACKEND_URL ??
  import.meta.env.VITE_BACKEND_URL ??
  'http://127.0.0.1:8000';
