const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const dir = __dirname;
const nextApp = next({ dev, dir });
const handle = nextApp.getRequestHandler();

let mainWindow;

app.whenReady().then(() => {
  nextApp.prepare().then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
    
    server.listen(0, (err) => {
      if (err) throw err;
      const port = server.address().port;
      
      mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, 'public', 'kfs-logo.ico'),
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });
      
      mainWindow.loadURL(`http://localhost:${port}`);
      mainWindow.setMenuBarVisibility(false);
      
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
