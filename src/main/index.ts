import { app } from 'electron'
// import { join } from 'path'
import { WindowManager } from './utils/electron/WindowManage'
import { createAboutWindow } from './Settings/AboutWindow'
import { createSettingsWindow } from './Settings/SettingsWindow'
import { createLinkBroWindow } from './LinkBro/LBWindow'
import { SettingsManager } from './utils/Settings/SettingsManager'
import createTray from './tray'
import { Notification } from 'electron'
import { setAutoLaunch } from './utils/electron/AutoLaunch'
// import { resolve } from 'path'

const windowManager = WindowManager.getInstance()
const dataManager = SettingsManager.getInstance()

async function initSM(){
  await dataManager.init().catch((err) => {
    console.error('Failed to initialize data manager:', err)
  })
}


app.whenReady().then(async () => {
  await initSM()
  setAutoLaunch()

  const notification = new Notification({
    title: 'Hello for DeskLayer',
    body: 'DeskLayer成功启动，设置在托盘里！'
  })

  createTray()


  console.log('awa')
  // console.log(resolve(__dirname,'src/renderer/src/'))
  const aboutWindow = createAboutWindow()
  windowManager.addWindow('about', aboutWindow)


  const settingsWindow = createSettingsWindow()
  windowManager.addWindow('settings', settingsWindow)
  

  const linkBroWindow = createLinkBroWindow()
  windowManager.addWindow('linkbro', linkBroWindow)

  notification.show()
})