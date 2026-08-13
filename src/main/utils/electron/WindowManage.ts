import { BrowserWindow } from 'electron'

export class WindowManager {
  private _windows = new Map<string, BrowserWindow>()

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
    this._windows.set(id, window)
  }

  getWindow(id: string): BrowserWindow | undefined {
    return this._windows.get(id)
  }

  destroyWindow(id: string): void {
    id
  }
}
