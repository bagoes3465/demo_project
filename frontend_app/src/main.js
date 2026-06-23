import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { spawn } from 'child_process';
import http from 'http';

if (started) app.quit();

const isDev = process.env.NODE_ENV === 'development' || !!MAIN_WINDOW_VITE_DEV_SERVER_URL;

let backendProcess = null;
const BACKEND_PORT = 8001;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// Start backend server
const startBackend = () => {
  return new Promise((resolve, reject) => {
    try {
      let backendPath;
      let pythonExe;
      
      if (isDev) {
        // Development mode: run Python backend directly
        // Get Project root from current working directory
        // When running npm start from frontend_app, cwd is frontend_app folder
        const projectRoot = path.resolve(process.cwd(), '..');
        pythonExe = path.join(projectRoot, '.venv', 'Scripts', 'python.exe');
        backendPath = path.join(projectRoot, 'backend_api', 'main.py');
        
        console.log('Project root:', projectRoot);
        console.log('Python executable:', pythonExe);
        console.log('Backend path:', backendPath);
        
        backendProcess = spawn(pythonExe, [backendPath], {
          stdio: 'inherit',
          cwd: path.join(projectRoot, 'backend_api'),
          env: { ...process.env, PYTHONUNBUFFERED: '1' },
        });
      } else {
        // Production mode: run compiled backend executable
        backendPath = path.join(process.resourcesPath, 'backend', 'main.exe');
        backendProcess = spawn(backendPath, {
          stdio: 'inherit',
          windowsHide: true,
        });
      }

      backendProcess.on('error', (err) => {
        console.error('Failed to start backend:', err);
        reject(err);
      });

      // Wait for backend to be ready
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      const checkBackendReady = () => {
        if (attempts >= maxAttempts) {
          reject(new Error('Backend failed to start within timeout'));
          return;
        }

        const req = http.get(`${BACKEND_URL}/api/health`, (res) => {
          if (res.statusCode === 200) {
            console.log('Backend is ready!');
            resolve();
          } else {
            attempts++;
            setTimeout(checkBackendReady, 1000);
          }
        });

        req.on('error', () => {
          attempts++;
          setTimeout(checkBackendReady, 1000);
        });
      };

      setTimeout(checkBackendReady, 500);
    } catch (err) {
      reject(err);
    }
  });
};

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
    // In production, connect to backend served UI or load local file
    if (!isDev) {
      mainWindow.loadURL(BACKEND_URL);
    } else {
      mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(async () => {
  try {
    // Start backend first
    await startBackend();
    // Then create the window
    createWindow();
  } catch (err) {
    console.error('Failed to start application:', err);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Kill backend process when all windows are closed
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch (err) {
      console.error('Error killing backend:', err);
    }
  }

  if (process.platform !== 'darwin') app.quit();
});
