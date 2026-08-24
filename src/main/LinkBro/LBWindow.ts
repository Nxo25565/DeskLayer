import { join } from 'path'
import { BrowserWindow, ipcMain, shell, globalShortcut, screen } from 'electron'
// import type { Shortcut } from '../../shared/Types/Shortcut'
import { SettingsManager } from '../utils/Settings/SettingsManager'
import { Searcher } from '../utils/Searcher'
// import { WindowManager } from '../utils/electron/WindowManage'
// import type { InsertCustomFileOptions } from '../utils/electron/WindowManage'

// const shortcuts: Shortcut[] = [
//   { name: 'Chrome', path: 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
//   { name: 'Edge', path: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
//   { name: 'Firefox', path: 'C:/Program Files/Mozilla Firefox/firefox.exe' },
//   { name: 'VS Code', path: 'C:/Users/Admin/AppData/Local/Programs/Microsoft VS Code/Code.exe' },
//   { name: 'Steam', path: 'C:/Program Files (x86)/Steam/Steam.exe' },
//   { name: 'Discord', path: 'C:/Users/Admin/AppData/Local/Discord/Update.exe' },
//   { name: 'Spotify', path: 'C:/Users/Admin/AppData/Roaming/Spotify/Spotify.exe' },
//   { name: 'Figma', path: 'C:/Users/Admin/AppData/Local/Figma/Figma.exe' },
//   { name: 'Photoshop', path: 'C:/Program Files/Adobe/Adobe Photoshop 2024/Photoshop.exe' },
//   { name: 'Notion', path: 'C:/Users/Admin/AppData/Local/Programs/Notion/Notion.exe' },
// ]

var isLinkBroShown = false

export function createLinkBroWindow(): BrowserWindow {
  const dataManager = SettingsManager.getInstance()

  const windowPreference = {
    width: 500,
    height: 600,

    transparent: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/lb_preload.js')
    },
    icon: 'public/icon.png',
    title: 'LinkBro',
    show: false,
    resizeable: false,
    frame: false
  }
  const pageFile = join(__dirname, '../renderer/LinkBroPage.html')

  const lbWindow = new BrowserWindow(windowPreference)
  lbWindow.loadFile(pageFile)

  

  // Sth for sys
  globalShortcut.register('Alt+S', () => {
    if (!isLinkBroShown) {
      const mousePos = screen.getCursorScreenPoint()
      lbWindow.setPosition(mousePos.x, mousePos.y)
      lbWindow.show()
    } else {
      lbWindow.hide()
    }
    isLinkBroShown = !isLinkBroShown
  })
  globalShortcut.register('Escape', () => {
    lbWindow.hide()
    isLinkBroShown = false
  })

  // FixByAI: 页面加载完成后再缩小
  lbWindow.webContents.on('did-finish-load', () => {
    lbWindow.webContents.setZoomFactor(0.85)
  })

  // FixByAI: 直接从 DataManager 获取最新数据
  ipcMain.handle('get-shortcuts', () => {
    return dataManager.shortcutSettings.shortcuts
  })

  // FixByAI: 搜索快捷键，复用已实现的 Searcher.search()
  ipcMain.handle('search-shortcuts', (_event, searchTerm: string) => {
    const searcher = Searcher.getInstance()
    return searcher.search(searchTerm, dataManager.shortcutSettings.shortcuts)
  })

  // GenByAI: 打开快捷方式
  ipcMain.handle('open-shortcut', (_event, shortcut: any) => {
    if (shortcut) {
      shell.openPath(shortcut.path)
    }
  })

  return lbWindow
}