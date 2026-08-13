import { app } from 'electron'
// import { join } from 'path'
import { WindowManager } from './utils/electron/WindowManage'
import { createAboutWindow } from './Settings/AboutWindow'
import { createSettingsWindow } from './Settings/SettingsWindow'
import { createLinkBroWindow } from './LinkBro/LBWindow'
import { SettingsDataManager } from './utils/DataManager'
// import { resolve } from 'path'

const windowManager = WindowManager.getInstance()
const dataManager = SettingsDataManager.getInstance()
dataManager.init().catch((err) => {
    console.error('Failed to initialize data manager:', err)
})



app.whenReady().then(() => {
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




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})