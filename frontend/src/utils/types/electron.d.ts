export {};

declare global {
  interface Window {
    __cdm_env: {
      BACKEND_HOST: string;
      BACKEND_PORT: number;
      BACKEND_URL: string;
    };
  }
}
