import { app } from "electron";
import { SettingsManager } from "../Settings/SettingsManager";


export function setAutoLaunch() {
    const sm = SettingsManager.getInstance()
    app.setLoginItemSettings({
        openAtLogin: sm.getGeneralSetting('launchOnBootstrap'),
        path: process.execPath,
        args:[]
    })
}