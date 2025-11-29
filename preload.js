const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("__cdm_env", {
	BACKEND_HOST: process.env.CDM_BACKEND_HOST || "127.0.0.1",
	BACKEND_PORT: process.env.CDM_BACKEND_PORT || 8000,
	BACKEND_URL: `http://${process.env.CDM_BACKEND_HOST || "127.0.0.1"}:${process.env.CDM_BACKEND_PORT || 8000}`,
});
