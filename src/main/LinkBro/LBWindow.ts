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
const sizeFix = 0.2

export function createLinkBroWindow(): BrowserWindow {
  const dataManager = SettingsManager.getInstance()
  let hideTimer : NodeJS.Timeout | null = null;

  const windowPreference = {
    width: 500 * (1+sizeFix),
    height: 600 * (1+sizeFix),

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
    frame: false,
  }
  const pageFile = join(__dirname, '../renderer/LinkBroPage.html')

  const lbWindow = new BrowserWindow(windowPreference)
  lbWindow.loadFile(pageFile)


  function hideWindow(){
    isLinkBroShown = false
    lbWindow.webContents.send('animation: lbwindow-hide')
    hideTimer?.close()
    hideTimer = setTimeout(() => {
      if (!isLinkBroShown) {   // Fix: 在窗口出现后掐掉隐藏行为，防止短时内窗口出现后突然隐藏
        lbWindow.hide()
      }
    }, 800)
  }
  

  // Sth for sys
  globalShortcut.register('Alt+S', () => {
    if (!isLinkBroShown) {
      const mousePos = screen.getCursorScreenPoint()
      lbWindow.setPosition(mousePos.x, mousePos.y)
      // 提前通知动画开始
      lbWindow.webContents.send('animation: lbwindow-show')

      lbWindow.show()
      isLinkBroShown = true
    } else {
      hideWindow()
    }
  })
  globalShortcut.register('Escape', () => {
    hideWindow()
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