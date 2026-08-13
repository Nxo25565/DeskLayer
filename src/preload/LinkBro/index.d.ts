import type { Shortcut } from '../../../shared/Types/Shortcut'

declare global {
  interface Window {
    linkbro: {
      getShortcuts(): Promise<Shortcut[]>
      openShortcut(index: number): Promise<void>
      // FixByAI: 搜索方法类型声明
      searchShortcuts(searchTerm: string): Promise<Shortcut[]>
    }
  }
}