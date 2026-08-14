// import { join,resolve } from 'path'
import { join } from 'path'
import { importFolderShortcuts } from '../utils/Path'
import { BrowserWindow,ipcMain } from 'electron'
import { dialog } from 'electron'
import { processLnkPath } from '../utils/Path'
import { Shortcut } from '../../shared/Types/Shortcut'


// import { VersionInfo } from '../../shared/Types/VersionInfo'

var isOpenedFileDialog = false


export function createSettingsWindow(): BrowserWindow {
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
      preload: join(__dirname, '../preload/settings_preload.js'),
      
    },
    // autoHideMenuBar: true,
    icon: 'public/icon.png',
    title: 'Settings',
    show: false,
    // titleBarStyle: 'hidden' as const
  }

  const pageFile = join(__dirname,'../renderer/SettingsPage.html')

  const aboutWindow = new BrowserWindow(windowPreference)
  aboutWindow.loadFile(pageFile)
  
  // Handles
  ipcMain.handle('setting:open-import-single-dialog',() => {
    return openImportSingleDialog()
  })
  ipcMain.handle('setting:open-import-folder-dialog',() => {
    return openImportFolderDialog()
  })


  return aboutWindow
}

async function openImportSingleDialog(){
  if (isOpenedFileDialog) return
  isOpenedFileDialog = true
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Link', extensions: ['lnk'] },
      { name: 'Executable', extensions: ['exe'] },
      { name: 'Batch', extensions: ['bat'] },
      { name: 'PowerShell', extensions: ['ps1'] },
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

async function openImportFolderDialog() : Promise<{
  shortcuts:Shortcut[],
  folderPath:string | null,
  failed:boolean}> {

  if (isOpenedFileDialog) { return { shortcuts: [], folderPath: null, failed: true } }
  isOpenedFileDialog = true
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
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