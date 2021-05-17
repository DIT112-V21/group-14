const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    icon: 'img/darkness_mcCroc.png',
    autoHideMenuBar: true,
    width: 1209,
    height: 825,
    resizable:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  })

  const child = new BrowserWindow({
    icon: 'img/darkness_mcCroc.png',
    autoHideMenuBar: true,
    width: 1209,
    height: 825,
    resizable:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  win.loadFile('index.html')
  child.loadFile('display_object_detection.html')
}



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
