import { Tray, Menu, app } from 'electron'
import { join } from 'path'
import { WindowManager } from './utils/electron/WindowManage'

// GenByAI: 创建托盘图标
const basePath = !app.isPackaged ? join(process.cwd(), './resources') : join(process.cwd(), './resources/app.asar.unpacked/resources')
const iconPath = join(basePath, 'icon32.png')
console.log(iconPath)

export default function createTray() {
  const wm = WindowManager.getInstance()

  const tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    { label: '设置', click: () => wm.getWindow('settings')?.show() },
    { type: 'separator' },
    { label: '退出', click: () => wm.quitApp() }
  ])
  tray.setToolTip('Huh?')
  tray.setContextMenu(contextMenu)
}
