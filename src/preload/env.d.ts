import { VersionInfo } from '../shared/Types/VersionInfo'
import { Shortcut } from '../shared/Types/Settings'

declare global {
  interface Window {
    about: {
      getVersion(): Promise<VersionInfo>
    }
    settings: {
      openAboutWin(): Promise<void>
      openImportSingleDialog(): Promise<any>
      openImportFolderDialog(): Promise<{
        shortcuts: Shortcut[]
        folderPath: string | null | undefined
        failed: boolean
      }>
      // GenByAI: 添加单个快捷方式
      addSingleShortcut(shortcut: Shortcut): Promise<void>
      // GenByAI: 移除单个快捷方式
      removeSingleShortcut(shortcut: Shortcut): Promise<void>
      // GenByAI: 添加多个快捷方式
      addMultipleShortcuts(shortcuts: Shortcut[]): Promise<void>
      // GenByAI: 移除多个快捷方式
      removeMultipleShortcuts(shortcuts: Shortcut[]): Promise<void>
      // GenByAI: 移除指定文件夹导入的所有快捷方式
      removeShortcutsByFolder(folderPath: string): Promise<void>
      // GenByAI: 设置通用配置项
      setGeneralOption(option: string, value: any): Promise<void>
      // GenByAI: 获取快捷方式列表
      getShortcuts(): Promise<Shortcut[]>
      // GenByAI: 获取通用配置
      getGeneral(): Promise<any>
      // GenByAI: 保存设置
      save(): Promise<void>
      // 获取已导入的文件夹列表
      getFolders(): Promise<string[]>
    }
    linkbro: {
      getShortcuts(): Promise<Shortcut[]>
      openShortcut(shortcut: any): Promise<void>
      // FixByAI: 搜索方法类型声明
      searchShortcuts(searchTerm: string): Promise<Shortcut[]>,
      onPlayShowAnimation(callback: () => void): void,
      onPlayHideAnimation(callback: () => void): void,
    }
  }
}
