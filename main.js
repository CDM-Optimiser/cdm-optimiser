const { app, BrowserWindow, dialog } = require("electron/main");
const path = require("node:path");
const { spawn } = require("child_process");
const fs = require("fs");

const BACKEND_PORT = process.env.CDM_BACKEND_PORT || 8000;
const BACKEND_HOST = process.env.CDM_BACKEND_HOST || "0.0.0.0";
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

const isDev = process.env.NODE_ENV === 'development';

let backendProcess = null;
let progressInterval = null;
let window = null;

if (process.platform === "linux") {
	app.disableHardwareAcceleration();
}

function getPackagedBackendPath() {
	const resourcesDir = process.resourcesPath;
	const exeName = process.platform === 'win32' ? 'backend-server.exe' : 'backend-server';

	const possiblePaths = [
		path.join(resourcesDir, exeName),
		path.join(resourcesDir, 'app.asar.unpacked', exeName),
		path.join(__dirname, exeName),
	];

	const found = possiblePaths.find((path) => fs.existsSync(path));

	if (!found) console.warn('Packaged backend not found in expected paths:', possiblePaths);

	return found || null;
}

function spawnBackend() {
	const packagedPath = getPackagedBackendPath();

	if (packagedPath) {
		backendProcess = spawn(packagedPath, [], {
			env: { ...process.env, PORT: BACKEND_PORT },
			detached: false,
			stdio: ["ignore", "pipe", "pipe"],
		});

		console.log("Spawned packaged backend:", packagedPath);
	} else {
		const pythonCmd = process.env.PYTHON_COMMAND || "python";
		const uvicornModule = process.env.UVICORN_MODULE || "uvicorn";
		const backendModule = "backend.app:app";

		const env = {
			...process.env,
			PYTHONPATH: path.resolve(__dirname),
			DATABASE_URL: process.env.DATABASE_URL || `sqlite:///${path.join(__dirname, "backend", "app.db")}`,
		};

		backendProcess = spawn(
			pythonCmd,
			["-m", uvicornModule, backendModule, "--host", BACKEND_HOST, "--port", `${BACKEND_PORT}`, "--log-level", "info"],
			{ env, stdio: ["ignore", "pipe", "pipe"] }
		);
		console.log("Spawned python backend via uvicorn:", pythonCmd);
	}

	if (!backendProcess) return;

	backendProcess.stdout.on("data", (chunk) => console.log("[backend stdout]", chunk.toString()));
	backendProcess.stderr.on("data", (chunk) => console.error("[backend stderr]", chunk.toString()));

	backendProcess.on("exit", (code, signal) => {
		console.log(`Backend process exited (code=${code}, signal=${signal})`);
	});
}

function killBackend() {
	if (!backendProcess) return;

	try {
		if (process.platform === "win32") {
			spawn("taskkill", ["/pid", backendProcess.pid, "/f", "/t"]);
		} else {
			backendProcess.kill("SIGTERM");
		}
	} catch (error) {
		console.error("Failed to kill backend:", error);
	}
}

async function waitForBackendReady(timeoutMs = 10000, intervalMs = 200) {
	const start = Date.now();

	while (Date.now() - start < timeoutMs) {
		try {
			const response = await fetch(`${BACKEND_URL}/api/patients?status=all`, { method: "GET" });

			if (response.ok) return true;
		} catch (error) {
		}

		await new Promise((r) => setTimeout(r, intervalMs));
	}
	return false;
}

function createWindow() {
	window = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
		},
	});

	window.setMenuBarVisibility(false);
	window.removeMenu();

	if (isDev) {
		window.webContents.openDevTools();
	}

	const indexPath = path.join(__dirname, "frontend", "dist", "index.html");

	if (fs.existsSync(indexPath)) {
		window.loadFile(indexPath, { hash: "/" });

		const INCREMENT = 0.03
		const INTERVAL_DELAY = 100

		let counter = 0

		progressInterval = setInterval(() => {
			window.setProgressBar(counter)

			if (counter < 2) {
				counter += INCREMENT
			} else {
				counter = (-INCREMENT * 5)
			}
		}, INTERVAL_DELAY)
	} else {
		const devUrl = process.env.DEV_SERVER_URL || "http://localhost:5173";

		window.loadURL(devUrl);
	}

	window.on("closed", () => {
		window = null;
	});
}

app.whenReady().then(() => {
	spawnBackend();
	createWindow();
});

app.on('before-quit', () => {
	clearInterval(progressInterval)
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("quit", () => {
	killBackend();
});

app.on("activate", function () {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
