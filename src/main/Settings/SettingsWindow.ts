// import { join,resolve } from 'path'
import { join } from 'path'
import { importFolderShortcuts } from '../utils/Path'
import { BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { dialog } from 'electron'
import { processLnkPath } from '../utils/Path'
import { Shortcut } from '../../shared/Types/Shortcut'

// import { VersionInfo } from '../../shared/Types/VersionInfo'


var isOpenedFileDialog = false
var isSettingsWindowShown = false;
var hideTimer;


export function createSettingsWindow(): BrowserWindow {

  const windowPreference = {
    width: 800,
    height: 900,
    resizable: true,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/settings_preload.js')
    },
    // autoHideMenuBar: true,
    icon: 'public/icon.png',
    title: 'Settings',
    show: false,
    
    // titleBarStyle: 'hidden' as const
  }

  const pageFile = join(__dirname, '../renderer/SettingsPage.html')

  const settingsWindow = new BrowserWindow(windowPreference)
  settingsWindow.loadFile(pageFile)

  // Handles
  ipcMain.handle('setting:open-import-single-dialog', () => {
    return openImportSingleDialog()
  })
  ipcMain.handle('setting:open-import-folder-dialog', () => {
    return openImportFolderDialog()
  })


    function hideWindow(){
      isSettingsWindowShown = false
      settingsWindow.webContents.send('animation: settings-window-hide')
      hideTimer?.close()
      hideTimer = setTimeout(() => {
        if (!isSettingsWindowShown) {
          settingsWindow.hide()
        }
      }, 800)
    }
    
  
    // Sth for sys
    globalShortcut.register('Alt+X', () => {
      
      if (!isSettingsWindowShown) {
        // 提前通知动画开始
        settingsWindow.webContents.send('animation: settings-window-show')
        settingsWindow.show()
        isSettingsWindowShown = true;
      } else {
        hideWindow()
      }
    })

  return settingsWindow
}

async function openImportSingleDialog() {
  if (isOpenedFileDialog) return
  isOpenedFileDialog = true
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Link', extensions: ['lnk'] },
      { name: 'Executable', extensions: ['exe'] },
      { name: 'Batch', extensions: ['bat'] },
      { name: 'PowerShell', extensions: ['ps1'] }
    ]
  })
  isOpenedFileDialog = false
  if (result.canceled) return
  const shortcuts = result.filePaths.map((path) => {
    return processLnkPath(path)
  })

  isOpenedFileDialog = false
  return shortcuts
}

async function openImportFolderDialog(): Promise<{
  shortcuts: Shortcut[]
  folderPath: string | null
  failed: boolean
}> {
  if (isOpenedFileDialog) {
    return { shortcuts: [], folderPath: null, failed: true }
  }
  isOpenedFileDialog = true
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  isOpenedFileDialog = false

  if (result.canceled) return { shortcuts: [], folderPath: null, failed: true }
  const shortcuts = importFolderShortcuts(result.filePaths[0])

  return {
    shortcuts: shortcuts,
    folderPath: result.filePaths[0],
    failed: false
  }

}
