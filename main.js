import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron/main';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: join(__dirname, 'preload.js'),
		},
	});

	win.removeMenu();

	const indexPath = join(app.getAppPath(), 'frontend/dist/index.html');
	win.loadFile(join(indexPath));
}

ipcMain.handle('dark-mode:get-source', () => {
	return nativeTheme.themeSource;
});

ipcMain.handle('dark-mode:set', (event, mode) => {
	nativeTheme.themeSource = mode;

	return true;
});

ipcMain.handle('dark-mode:system', () => {
	nativeTheme.themeSource = 'system';
});

ipcMain.handle('dark-mode:toggle', () => {
	if (nativeTheme.shouldUseDarkColors) {
		nativeTheme.themeSource = 'light';
	} else {
		nativeTheme.themeSource = 'dark';
	}
	return nativeTheme.shouldUseDarkColors;
});

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
