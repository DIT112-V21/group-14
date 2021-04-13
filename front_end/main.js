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
      preload: path.join(__dirname, 'preload.js')
    },
  })

  win.loadFile('index.html')
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
