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
      addSingleShortcut(shortcut: Shortcut): Promise<void>
      removeSingleShortcut(shortcut: Shortcut): Promise<void>
      addMultipleShortcuts(shortcuts: Shortcut[]): Promise<void>
      removeMultipleShortcuts(shortcuts: Shortcut[]): Promise<void>
      removeShortcutsByFolder(folderPath: string): Promise<void>
      setGeneralOption(option: string, value: any): Promise<void>
      getShortcuts(): Promise<Shortcut[]>
      getGeneral(): Promise<any>
      save(): Promise<void>
      // 获取已导入的文件夹列表
      getFolders(): Promise<string[]>,
      getGeneralOption(option: string): Promise<any>,
    }
    linkbro: {
      getShortcuts(): Promise<Shortcut[]>
      openShortcut(shortcut: any): Promise<void>
      searchShortcuts(searchTerm: string): Promise<Shortcut[]>,
      onPlayShowAnimation(callback: () => void): void,
      onPlayHideAnimation(callback: () => void): void,
    }
  }
}