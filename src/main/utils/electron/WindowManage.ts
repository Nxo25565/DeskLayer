import { BrowserWindow,app } from 'electron'

export class WindowManager {
  private _windows = new Map<string, BrowserWindow>()
  private _quitApp = false;

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
  }

  getWindow(id: string): BrowserWindow | undefined {
    return this._windows.get(id)
  }

  destroyWindow(id: string): void {
    id
  }

  quitApp(){
    this._quitApp = true;
    app.quit()
  }
}