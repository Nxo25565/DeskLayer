import type { VersionInfo } from '../../../shared/Types/VersionInfo'
import type { Shortcut } from '../../../shared/Types/Shortcut'

declare global {
  interface Window {
    about: {
      getVersion(): Promise<VersionInfo>
    },
    settings : {
      openAboutWin(): Promise<void>,
      openImportSingleDialog(): Promise<any>,
      openImportFolderDialog(): Promise<{
        shortcuts:Shortcut[],
        folderPath:string | null | undefined,
        failed:boolean}>,
      // 添加单个快捷方式
      addSingleShortcut(shortcut: Shortcut): Promise<void>,
      // 移除单个快捷方式
      removeSingleShortcut(shortcut: Shortcut): Promise<void>,
      // 添加多个快捷方式
      addMultipleShortcuts(shortcuts: Shortcut[]): Promise<void>,
      // 移除多个快捷方式
      removeMultipleShortcuts(shortcuts: Shortcut[]): Promise<void>,
      // GenByAI: 移除指定文件夹导入的所有快捷方式
      removeShortcutsByFolder(folderPath: string): Promise<void>,
      // 设置通用配置项
      setGeneralOption(option: string, value: any): Promise<void>,
      // 获取快捷方式列表
      getShortcuts(): Promise<Shortcut[]>,
      // 获取通用配置
      getGeneral(): Promise<any>,
      // 保存设置
      save(): Promise<void>,
      // 获取已导入的文件夹列表
      getFolders(): Promise<string[]>,
    }
  }
}