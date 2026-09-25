import { app } from "electron";
import { SettingsManager } from "../Settings/SettingsManager";


export function setAutoLaunch() {
    console.log("process.execPath:", process.execPath)
    const sm = SettingsManager.getInstance()
    sm.onSettingsChanged(() => {
        console.log("settings changed")
        const sm = SettingsManager.getInstance()
        app.setLoginItemSettings({
            openAtLogin: sm.getGeneralSetting('launchOnBootstrap'),
            path: process.execPath,
            args:[]
    })})
}
