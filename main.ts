import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
// import * as download from './core/download-akroma.js';
// import * as clientControl from './core/start-akroma.js';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

try {
  require('dotenv').config();
} catch {
  console.log('asar');
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    // if (clientControl.clientRunning() === false) {
    //   const startClient = clientControl.startClient;
    //   if (download.akromaClientExists() === false) {
    //     download.downloadAkromaClient((success, err) => {
    //       if (err) {
    //         throw new Error('Akroma client could not be started.')
    //       }
    //       const client = startClient();
    //       client.stdout.on('data', function(data) {
    //         console.log(data.toString());
    //       });
    //       client.stderr.on('data', function(data) {
    //         console.log(data.toString());
    //       });
    //       client.on('exit', function(code, signal) {
    //         console.log(code, signal);
    //       });
    //     });
    //   } else {
    //     const client = startClient();
    //     client.stdout.on('data', function(data) {
    //       console.log(data.toString());
    //     });
    //     client.stderr.on('data', function(data) {
    //       console.log(data.toString());
    //     });
    //     client.on('exit', function(code, signal) {
    //       console.log(code, signal);
    //     });
    //   }
    // }
    createWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      // clientControl.clientProcess.kill();
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
