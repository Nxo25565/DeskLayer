import { contextBridge, ipcRenderer } from 'electron'
import type { VersionInfo } from '../../shared/Types/VersionInfo'
import type { Shortcut } from '../../shared/Types/Shortcut'
import { GeneralSettingOption } from '../../shared/Types/Settings'

contextBridge.exposeInMainWorld('about', {
  getVersion: (): Promise<VersionInfo> => ipcRenderer.invoke('about:get-version')
})
contextBridge.exposeInMainWorld('settings', {
  openAboutWin: (): Promise<void> => ipcRenderer.invoke('setting:open-about'),
  openImportSingleDialog: (): Promise<any> =>
    ipcRenderer.invoke('setting:open-import-single-dialog'),
  openImportFolderDialog: (): Promise<{
    shortcuts: Shortcut[]
    folderPath: string | null | undefined
    failed: boolean
  }> => ipcRenderer.invoke('setting:open-import-folder-dialog'),
  // 添加单个快捷方式
  addSingleShortcut: (shortcut: Shortcut): Promise<void> =>
    ipcRenderer.invoke('settings:add-single-shortcuts', shortcut),
  // 移除单个快捷方式
  removeSingleShortcut: (shortcut: Shortcut): Promise<void> =>
    ipcRenderer.invoke('settings:remove-single-shortcuts', shortcut),
  // 添加多个快捷方式
  addMultipleShortcuts: (shortcuts: Shortcut[]): Promise<void> =>
    ipcRenderer.invoke('settings:add-multiple-shortcuts', shortcuts),
  // 移除多个快捷方式
  removeMultipleShortcuts: (shortcuts: Shortcut[]): Promise<void> =>
    ipcRenderer.invoke('settings:remove-multiple-shortcuts', shortcuts),
  // GenByAI: 移除指定文件夹导入的所有快捷方式
  removeShortcutsByFolder: (folderPath: string): Promise<void> =>
    ipcRenderer.invoke('settings:remove-shortcuts-by-folder', folderPath),
  // 设置通用配置项
  setGeneralOption: (option: string, value: any): Promise<void> =>
    ipcRenderer.invoke('settings:set-general-option', option, value),
  // 获取快捷方式列表
  getShortcuts: (): Promise<Shortcut[]> => ipcRenderer.invoke('settings:get-shortcuts'),
  // 获取通用配置
  getGeneral: (): Promise<GeneralSettingOption[]> => ipcRenderer.invoke('settings:get-general'),
  // 根据选项名获取通用配置项
  getGeneralOption: (option: string): Promise<any> => ipcRenderer.invoke('settings:get-general-option', option),
  // 保存设置
  save: (): Promise<void> => ipcRenderer.invoke('settings:save'),
  // 获取已导入的文件夹列表
  getFolders: (): Promise<string[]> => ipcRenderer.invoke('settings:get-folders')
})
