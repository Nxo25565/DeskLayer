import { readFile, mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { Shortcut } from '../../../shared/Types/Shortcut'
import { isShortcutEqual } from '../../../shared/Types/Shortcut'
import { ipcMain,app } from 'electron'
import path from 'path'
import { getFolders } from '../Path'

const saveInterval = 1000


interface GeneralSettingOptions {
    
}
interface ShortcutSettingOptions {
    shortcuts: Shortcut[],
    folders: string[] // cached after loaded
}
// out main
// console.log('DIR: ',process.cwd())

if (app.isPackaged){
var settingFiles = {
    shortcuts: path.join(__dirname,'./settings/shortcuts.json'),
    general: path.join(__dirname,'./settings/general.json'),
}
} else {
  var settingFiles = {
    shortcuts: path.join(process.cwd(), 'debug_datas', './settings/shortcuts.json'),
    general: path.join(process.cwd(), 'debug_datas', './settings/general.json')
  }
}


var baseSettingsPath = path.join(__dirname,'./settings/')

function createDefaultGeneralSettings() : GeneralSettingOptions{
    return {}
}

function createDefaultShortcutSettings() : ShortcutSettingOptions{
    return {
        shortcuts: [],
        folders: []
    }
}


export class SettingsManager {
  private static instance: SettingsManager

  private _saveTimer
  private _savePromised = false

  // private _uuid = ''

    // Coming soon
    private _generalSettings: GeneralSettingOptions = createDefaultGeneralSettings();


    private _shortcutSettings: ShortcutSettingOptions = createDefaultShortcutSettings();
    

  // GenByAI: 获取 DataManager 实例
  public static getInstance(): SettingsManager {
    // 如果实例不存在，则创建一个新的实例
    if (!this.instance) {
      this.instance = new SettingsManager()
    }
    // 返回已存在的实例或新创建的实例
    return this.instance
  }

  // GenByAI: 获取 generalSettings
  public get shortcutSettings(): ShortcutSettingOptions {
    return this._shortcutSettings
  }

    // GenByAI: 获取 generalSettings
    public get generalSettings(): GeneralSettingOptions {
        return this._generalSettings;
    }

  public setGeneralSettingsOptions(option: string, value: any) {
    if (this._generalSettings) {
      this._generalSettings[option] = value
      this.saveSettings()
    }
  }

  public addShortcut(shortcut: Shortcut) {
    if (this._shortcutSettings) {
      if (!this._shortcutSettings.shortcuts.some((s) => isShortcutEqual(s, shortcut))) {
        this._shortcutSettings.shortcuts.unshift(shortcut)
      }
      this.saveSettings()
    }
  }

  public removeShortcut(shortcut: Shortcut) {
    if (this._shortcutSettings) {
      // FixByAI: 使用 isShortcutEqual 做值比较，替代引用比较（IPC 传输后引用不同）
      const index = this._shortcutSettings.shortcuts.findIndex((s) => isShortcutEqual(s, shortcut))
      if (index !== -1) {
        this._shortcutSettings.shortcuts.splice(index, 1)
      }
      this.saveSettings()
    }
  }

  // short_cute???
  public addMulitShortcute(shortcuts: Shortcut[]) {
    for (const shortcut of shortcuts) {
      this.addShortcut(shortcut)
    }
    this.saveSettings()
  }

  public removeShortcuts(shortcutsToRemove: Shortcut[]) {
    if (this._shortcutSettings) {
      this._shortcutSettings.shortcuts = this._shortcutSettings.shortcuts.filter(
        (shortcut) => !shortcutsToRemove.some((s) => isShortcutEqual(s, shortcut))
      )
      this.saveSettings()
    }
  }

  // GenByAI: 移除指定文件夹导入的所有快捷方式
  public removeShortcutsByFolder(folderPath: string) {
    if (this._shortcutSettings) {
      this._shortcutSettings.shortcuts = this._shortcutSettings.shortcuts.filter(
        (shortcut) => shortcut.importedFromFolder !== folderPath
      )
      this.saveSettings()
    }
  }

  // GenByAI: 读取设置文件
  public async loadData() {
    try {
      const shortcuts = JSON.parse(await readFile(settingFiles.shortcuts, 'utf-8'))
      const general = JSON.parse(await readFile(settingFiles.general, 'utf-8'))
      this._generalSettings = general
      this._shortcutSettings = shortcuts
    } catch (error) {
      console.error(`Error reading settings file: ${error}`)
    }
  }

  getFolders(): string[] {
    return this._shortcutSettings?.folders || []
  }

  // GenByAI: 注册 IPC 处理程序
  registerIpcHandlers() {
    // 添加单个快捷方式
    ipcMain.handle('settings:add-single-shortcuts', (_event, shortcut: Shortcut) => {
      this.addShortcut(shortcut)
    })

    // 移除单个快捷方式
    ipcMain.handle('settings:remove-single-shortcuts', (_event, shortcut: Shortcut) => {
      this.removeShortcut(shortcut)
    })

    // 添加多个快捷方式
    ipcMain.handle('settings:add-multiple-shortcuts', (_event, shortcuts: Shortcut[]) => {
      this.addMulitShortcute(shortcuts)
    })

    // 移除多个快捷方式
    ipcMain.handle('settings:remove-multiple-shortcuts', (_event, shortcuts: Shortcut[]) => {
      this.removeShortcuts(shortcuts)
    })

    // GenByAI: 移除指定文件夹导入的所有快捷方式
    ipcMain.handle('settings:remove-shortcuts-by-folder', (_event, folderPath: string) => {
      this.removeShortcutsByFolder(folderPath)
    })

    // 设置通用配置项
    ipcMain.handle('settings:set-general-option', (_event, option: string, value: any) => {
      this.setGeneralSettingsOptions(option, value)
    })

    // 获取快捷方式列表
    ipcMain.handle('settings:get-shortcuts', () => {
      return this._shortcutSettings.shortcuts
    })

    // 获取通用配置
    ipcMain.handle('settings:get-general', () => {
      return this._generalSettings
    })

    // 保存设置
    ipcMain.handle('settings:save', () => {
      this.saveSettings()
    })

    // 获取已导入的文件夹列表
    ipcMain.handle('settings:get-folders', () => {
      return getFolders(this._shortcutSettings?.shortcuts || [])
    })
  }

  // GenByAI: 移除 IPC 处理程序
  removeIpcHandlers() {
    ipcMain.removeHandler('settings:add-single-shortcuts')
    ipcMain.removeHandler('settings:remove-single-shortcuts')
    ipcMain.removeHandler('settings:add-multiple-shortcuts')
    ipcMain.removeHandler('settings:remove-multiple-shortcuts')
    ipcMain.removeHandler('settings:remove-shortcuts-by-folder')
    ipcMain.removeHandler('settings:set-general-option')
    ipcMain.removeHandler('settings:get-shortcuts')
    ipcMain.removeHandler('settings:get-general')
    ipcMain.removeHandler('settings:save')
    ipcMain.removeHandler('settings:get-folders')
  }

  async checkFiles() {
    console.log(`
            existence:
             shortcuts: ${settingFiles.shortcuts} | ${existsSync(settingFiles.shortcuts)}
             general: ${settingFiles.general}$ | {existsSync(settingFiles.general)}
             `)
    if (!existsSync(baseSettingsPath)) {
      await mkdir(baseSettingsPath)
    }
    if (!existsSync(settingFiles.shortcuts)) {
      await writeFile(settingFiles.shortcuts, JSON.stringify(this._shortcutSettings))
      console.log('shortcut file created')
    }
    if (!existsSync(settingFiles.general)) {
      await writeFile(settingFiles.general, JSON.stringify(this._generalSettings))
      console.log('general file created')
    }
  }

  // GenByAI: 防抖保存，规定时间内只写一次
  private scheduleSave() {
    if (this._saveTimer) {
      clearInterval(this._saveTimer)
    }
    this._saveTimer = setInterval(async () => {
      await this.saveAll()
    }, saveInterval)
  }

  // GenByAI: 保存所有设置
  private async saveAll() {
    if (!this._savePromised) {
      return
    }
    try {
      await writeFile(settingFiles.shortcuts, JSON.stringify(this._shortcutSettings, null, 2))
      await writeFile(settingFiles.general, JSON.stringify(this._generalSettings, null, 2))

      this._savePromised = false

      console.log('Settings saved successfully')
    } catch (error) {
      console.error(`Error saving settings: ${error}`)
    }
  }

  saveSettings() {
    this._savePromised = true
    console.log('Saving settings...')
    console.log(this._generalSettings)
    console.log(this._shortcutSettings)
  }

    async init() {
        // this._generalSettings = createDefaultGeneralSettings()
        // this._shortcutSettings = createDefaultShortcutSettings()
        this._shortcutSettings.folders = getFolders(this._shortcutSettings.shortcuts)
        // this._uuid = crypto.randomUUID()

    await this.checkFiles()
    await this.loadData()
    this.registerIpcHandlers()
    this.scheduleSave()
  }
}
