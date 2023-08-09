// Enable strict mode for better JavaScript code quality.
'use strict'

// Import necessary modules from Electron.
import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, Notification } from 'electron'

// Import createProtocol from vue-cli-plugin-electron-builder library.
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

// Import the custom database module.
import './services/db/db.js'; // Import the db.js file

// Import D-Bus module.
let dbus = require("dbus-next")

// Define variables for D-Bus communication.
let probject, bus, ahenk, message

// Define a function to get the D-Bus object.
async function getObject() {
  bus = dbus.sessionBus();
  probject = await bus.getProxyObject("org.ahenkdesk.dbus.Daemon", "/org/ahenkdesk/dbus/Daemon");
  ahenk = probject.getInterface("org.ahenkdesk.dbus.Daemon")
}

// Define a function to introduce a delay using a Promise.
function delay(waitTime) {
  return new Promise((resolve) => setTimeout(function () { resolve(); }, waitTime))
}

// Define a function to continuously receive messages from the D-Bus interface.
async function getMessage() {
  while (true) {
    if (ahenk !== undefined) {
      message = await ahenk.messageIncome();
    }
    await delay(3000)
  }
}

// Define variables for the main window and tray.
let win, tray;

// Check if the application is in development mode.
const isDevelopment = process.env.NODE_ENV !== 'production'

// Register schemes as privileged for Electron.
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Function to create the main Electron window.
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: 'src/assets/images/logo/tray.png',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone.
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info.
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    },
    // Keep the window frame.
    frame: true,
  })

  // Load the appropriate URL based on the environment.
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode.
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development.
    win.loadURL('app://./index.html')
  }

  // Minimize to tray on close.
  win.on('close', (event) => {
    event.preventDefault()
    win.hide()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Re-create a window when the dock icon is clicked (only on macOS).
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from the parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// Create the main tray and define context menu items.
app.whenReady().then(async () => {

  // Get the D-Bus object and check for incoming messages.
  getObject();
  getMessage();

  tray = new Tray('./src/assets/images/logo/tray.png')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click() {
        win.show()
      },
    },
    {
      label: "noti",
      click() {
        notification.show();
      }
    },
    {
      label: "Quit Absolute",
      click: quitApplication
    },
  ])
  tray.setToolTip('Ahenkdesk')
  tray.setContextMenu(contextMenu)
  tray.addListener("click", () => {
    win.show()
  })

  const notification = new Notification({
    title: 'Bildirim Başlığı',
    body: 'Bu bir bildirim metni, detaylı bilgi için tıklayınız.',
  })

  notification.on('click', () => {

    // Execute your function here.
    showNotification('My Notification', `
      <h1>BİLDİRİM BAŞLIĞI</h1>
      <p>Bildirim için body.</p>
      <p>Link: <a href="https://www.google.com">Google</a></p>
    `)
  });

})

// Function to quit the application gracefully.
function quitApplication() {
  tray.destroy();
  win.destroy();
  app.quit();
}

// Function to show a custom notification as a BrowserWindow.
function showNotification(title, html) {
  let notification = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    alwaysOnTop: true,
    frame: true,
    skipTaskbar: true,
    backgroundColor: '#333',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const nullMenu = Menu.buildFromTemplate([])
  notification.setMenu(nullMenu)

  // Load custom HTML content for the notification window.
  notification.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            color: #fff;
            font-family: sans-serif;
          }
          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        ${html}
        <div class="close-button">Close</div>
        <script>
          const closeButton = document.querySelector('.close-button')
          closeButton.addEventListener('click', () => {
            window.close()
          })
        </script>
      </body>
    </html>
  `)}`)

  notification.on('closed', () => {
    notification = null
  })
}

// IPC event handler for "request-data-from-main" message.
ipcMain.on('request-data-from-main', (event) => {
  event.reply('response-data-from-main', message)
})

// IPC event handlers for button clicks.
ipcMain.on('minimize-clicked', (event, arg) => {
  win.minimize()
})

let fullScreen = false;
ipcMain.on('maximize-clicked', (event, arg) => {
  fullScreen = !fullScreen
  win.setFullScreen(fullScreen)
})

ipcMain.on('exit-clicked', (event, arg) => {
  event.preventDefault()
  win.hide()
})
