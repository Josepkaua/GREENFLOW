import { app, shell, BrowserWindow, nativeTheme } from 'electron'
import { join } from 'path'
import { getDb } from './db'
import { getConfig } from './db/repositories/configRepository'
import { registerSalasHandlers } from './ipc/salasHandlers'
import { registerArCondicionadosHandlers } from './ipc/arCondicionadosHandlers'
import { registerConfigHandlers } from './ipc/configHandlers'
import { registerDashboardHandlers } from './ipc/dashboardHandlers'
import { registerPdfHandlers } from './ipc/pdfHandlers'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    title: 'Green Flow',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow?.show())

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  getDb()
  nativeTheme.themeSource = getConfig().tema

  registerSalasHandlers()
  registerArCondicionadosHandlers()
  registerConfigHandlers()
  registerDashboardHandlers()
  registerPdfHandlers(() => mainWindow)

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
