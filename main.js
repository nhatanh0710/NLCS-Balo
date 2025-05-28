const { app, BrowserWindow } = require('electron');

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('src/index.html');
    // ✅ Xóa localStorage khi khởi động
    win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript('localStorage.clear();');
    });
}

app.whenReady().then(createWindow);
