const { app, BrowserWindow, dialog } = require("electron/main");
const path = require("node:path");
const { spawn } = require("child_process");
const fs = require("fs");

const BACKEND_PORT = process.env.CDM_BACKEND_PORT || 8000;
const BACKEND_HOST = process.env.CDM_BACKEND_HOST || "0.0.0.0";
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;
const CHECK_URL = `http://127.0.0.1:${BACKEND_PORT}`;

const isDev = process.env.NODE_ENV === 'development';

let backendProcess = null;
let progressInterval = null;
let window = null;

if (process.platform === "linux") {
	app.disableHardwareAcceleration();
}

function getPackagedBackendPath() {
	const resourcesDir = process.resourcesPath;
	const possible = [
		path.join(resourcesDir, "backend-server"),
		path.join(resourcesDir, "backend-server.exe"),
	];

	return possible.find((package) => fs.existsSync(package)) || null;
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
	} catch (err) {
		console.error("Failed to kill backend:", err);
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

app.whenReady().then(async () => {
	spawnBackend();

	const ready = await waitForBackendReady(10000, 250);

	if (!ready) {
		dialog.showMessageBox({
			type: "warning",
			title: "Backend not responding",
			message:
				"The local backend did not become available within the timeout. The UI may not show data. Check logs in the console or run the backend manually.",
		});
	}

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
	if (backendProcess) {
		try {
			if (process.platform === "win32") {
				spawn("taskkill", ["/pid", backendProcess.pid, "/f", "/t"]);
			} else {
				backendProcess.kill("SIGTERM");
			}
		} catch (e) {
			console.error("Error killing backend:", e);
		}
	}
});

app.on("activate", function () {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
