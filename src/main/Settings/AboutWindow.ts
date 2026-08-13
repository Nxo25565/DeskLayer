// import { join,resolve } from 'path'
import { join } from 'path'
import { BrowserWindow, ipcMain } from 'electron'
// import { VersionInfo } from '../../shared/Types/VersionInfo'
import { getVersion } from '../utils/electron/Version'

export function createAboutWindow(): BrowserWindow {
  const windowPreference = {
    width: 800,
    height: 600,
    // resizable: false,
    // frame: false,
    transparent: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/settings_preload.js')
    },
    icon: 'public/icon.png',
    title: 'About',
    show: false,
    titleBarStyle: 'hidden' as const
  }

  const pageFile = join(__dirname, '../renderer/AboutPage.html')

  const aboutWindow = new BrowserWindow(windowPreference)
  aboutWindow.loadFile(pageFile)

  ipcMain.handle('about:get-version', () => {
    return getVersion()
  })
  ipcMain.handle('setting:open-about', () => {
    aboutWindow.show()
  })

  return aboutWindow
}
