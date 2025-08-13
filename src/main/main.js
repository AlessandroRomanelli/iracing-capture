const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const screenshot = require('screenshot-desktop');
const ffi = require('ffi-napi');

// Supported resolutions
const RESOLUTIONS = {
  '1080p': { width: 1920, height: 1080 },
  '2k': { width: 2560, height: 1440 },
  '4k': { width: 3840, height: 2160 },
  '8k': { width: 7680, height: 4320 }
};

// Minimal subset of Win32 APIs used to manipulate the iRacing window
// This mirrors the behaviour of the original tool which resized the
// simulator window before taking the screenshot.
const user32 = new ffi.Library('user32', {
  'FindWindowA': ['long', ['string', 'string']],
  'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
  'ShowWindow': ['bool', ['long', 'int']],
  'SetForegroundWindow': ['bool', ['long']]
});

// Moves and resizes the iRacing window to the requested resolution
function resizeIRacing(width, height) {
  const handle = user32.FindWindowA(null, 'iRacing.com Simulator');
  if (handle === 0) {
    throw new Error('iRacing window not found');
  }
  // 0x0040 = SWP_SHOWWINDOW
  const SWP_SHOWWINDOW = 0x0040;
  user32.SetWindowPos(handle, 0, 0, 0, width, height, SWP_SHOWWINDOW);
  user32.ShowWindow(handle, 3); // SW_MAXIMIZE
  user32.SetForegroundWindow(handle);
  return handle;
}

async function captureAt(resKey) {
  const res = RESOLUTIONS[resKey];
  if (!res) throw new Error('Unsupported resolution');
  resizeIRacing(res.width, res.height);
  // Give the sim a moment to render at the new size
  await new Promise(r => setTimeout(r, 1000));
  const img = await screenshot({ format: 'png' });
  const file = path.join(app.getPath('pictures'), `iracing_${resKey}.png`);
  fs.writeFileSync(file, img);
  return file;
}

// Handle capture requests from the renderer process
ipcMain.handle('capture', async (event, resKey) => {
  return await captureAt(resKey);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
