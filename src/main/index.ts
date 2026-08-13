import { app } from 'electron'
// import { join } from 'path'
import { WindowManager } from './utils/electron/WindowManage'
import { createAboutWindow } from './Settings/AboutWindow'
import { createSettingsWindow } from './Settings/SettingsWindow'
import { createLinkBroWindow } from './LinkBro/LBWindow'
import { SettingsDataManager } from './utils/DataManager'
import createTray from './tray'
// import { resolve } from 'path'

const windowManager = WindowManager.getInstance()
const dataManager = SettingsDataManager.getInstance()
dataManager.init().catch((err) => {
    console.error('Failed to initialize data manager:', err)
})



app.whenReady().then(() => {
    createTray()

    if (false){
        console.log("awa")
        // console.log(resolve(__dirname,'src/renderer/src/'))
        const aboutWindow = createAboutWindow()
        windowManager.addWindow('about', aboutWindow)
    }
    if (true){
        const settingsWindow = createSettingsWindow()
        windowManager.addWindow('settings', settingsWindow)
        settingsWindow.show()
    }

    const linkBroWindow = createLinkBroWindow()
    windowManager.addWindow('linkbro', linkBroWindow)
    




})




// FixByAI: 关闭窗口时隐藏到托盘，不退出应用
app.on('window-all-closed', () => {
    // 不退出，托盘保持运行
})