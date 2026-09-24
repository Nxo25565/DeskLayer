/// <reference path="./libs/animejs-4.5.0/anime.umd.js" />

declare var anime: typeof import('./libs/animejs-4.5.0/anime.umd.js')

declare interface Window {
  anime: typeof import('./libs/animejs-4.5.0/anime.umd.js')
  lbAnimation: {
      // getShortcuts(): Promise<Shortcut[]>
      openShortcut(shortcut: any): Promise<void>
      // FixByAI: 搜索方法类型声明
      // searchShortcuts(searchTerm: string): Promise<Shortcut[]>,
      onPlayShowAnimation(callback: () => void): void,
      onHideAnimation(callback: () => void): void,
  },
  settings: {
    getGeneral(): Promise<any>,
    getGeneralOption(option: string): Promise<any>,
  }
}