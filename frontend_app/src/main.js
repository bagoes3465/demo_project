import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

if (started) app.quit();

const isDev = process.env.NODE_ENV === 'development' || !!MAIN_WINDOW_VITE_DEV_SERVER_URL;

const getAssetPath = (assetName) => {
  if (isDev) {
    // Gunakan process.cwd() untuk get project root
    return path.resolve(process.cwd(), 'src', 'assets', assetName);
  } else {
    // Di production, assets di folder resources
    return path.join(process.resourcesPath, 'assets', assetName);
  }
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: !isDev,
    frame: isDev,
    icon: getAssetPath('icons/icons/win/icon.ico'), // Gunakan icon yang baru digenerate
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
