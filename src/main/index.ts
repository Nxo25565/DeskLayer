import { app } from 'electron'
// import { join } from 'path'
import { WindowManager } from './utils/electron/WindowManage'
import { createAboutWindow } from './Settings/AboutWindow'
import { createSettingsWindow } from './Settings/SettingsWindow'
import { createLinkBroWindow } from './LinkBro/LBWindow'
import { SettingsManager } from './utils/Settings/SettingsManager'
import createTray from './tray'
import { Notification } from 'electron'
// import { resolve } from 'path'

const windowManager = WindowManager.getInstance()
const dataManager = SettingsManager.getInstance()
dataManager.init().catch((err) => {
  console.error('Failed to initialize data manager:', err)
})

app.whenReady().then(() => {
  const notification = new Notification({
    title: 'Hello for DeskLayer',
    body: 'DeskLayer成功启动，设置在托盘里！'
  })

  createTray()

  if (true) {
    console.log('awa')
    // console.log(resolve(__dirname,'src/renderer/src/'))
    const aboutWindow = createAboutWindow()
    windowManager.addWindow('about', aboutWindow)
  }
  if (true) {
    const settingsWindow = createSettingsWindow()
    windowManager.addWindow('settings', settingsWindow)
  }

  const linkBroWindow = createLinkBroWindow()
  windowManager.addWindow('linkbro', linkBroWindow)

  notification.show()
})

// FixByAI: 关闭窗口时隐藏到托盘，不退出应用
app.on('window-all-closed', () => {
  // 不退出，托盘保持运行
})
