import { BrowserWindow, app } from 'electron'
import { getWebFileList, insertWebFiles } from './FileInsert'
import { reloadStyle } from './FileInsert'

// console.log(`ResourcesPath: ${basePath}`)

export class WindowManager {
  private _windows = new Map<string, BrowserWindow>()
  private _quitApp = false

  private static instance: WindowManager

  // GenByAI: 获取 WindowManager 实例
  public static getInstance(): WindowManager {
    if (!this.instance) {
      this.instance = new WindowManager()
    }
    return this.instance
  }

  constructor() {}

  addWindow(id: string, window: BrowserWindow) {
    // FixByAI: 关闭窗口时隐藏到托盘，不真正关闭
    window.on('close', (e) => {
      if (this._quitApp) {
        window.close()
        return
      }
      e.preventDefault()
      window.hide()
    })
    this._windows.set(id, window)

    // 页面加载完成后再注入自定义文件
    window.webContents.on('did-finish-load', async () => {
      await insertWebFiles(id, getWebFileList(id))
    })

    // 监听 F12 快捷键，重新加载样式
    window.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') {
        event.preventDefault()
        reloadStyle(id)
      }
    })
  }

  getWindow(id: string): BrowserWindow | undefined {
    return this._windows.get(id)
  }

  quitApp() {
    this._quitApp = true
    app.quit()
  }
}
