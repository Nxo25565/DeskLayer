import type { Shortcut } from '../../../shared/Types/Shortcut'

declare global {
  interface Window {
    linkbro: {
      getShortcuts(): Promise<Shortcut[]>
      openShortcut(shortcut: any): Promise<void>
      // FixByAI: 搜索方法类型声明
      searchShortcuts(searchTerm: string): Promise<Shortcut[]>
    }
  }
}