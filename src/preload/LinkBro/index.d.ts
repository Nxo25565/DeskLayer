import type { Shortcut } from '../../../shared/Types/Shortcut'

declare global {
  interface Window {
    linkbro: {
      getShortcuts(): Promise<Shortcut[]>
      openShortcut(shortcut: any): Promise<void>
      searchShortcuts(searchTerm: string): Promise<Shortcut[]>,
      onPlayShowAnimation: (callback: () => void) => void,
      onHideAnimation: (callback: () => void) => void,
    }
  }
}