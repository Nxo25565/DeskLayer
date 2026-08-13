import { contextBridge, ipcRenderer } from 'electron'
import type { Shortcut } from '../../shared/Types/Shortcut'

contextBridge.exposeInMainWorld('linkbro', {
  getShortcuts: (): Promise<Shortcut[]> => ipcRenderer.invoke('settings:get-shortcuts'),
  openShortcut: (shortcut: any): Promise<void> => ipcRenderer.invoke('open-shortcut', shortcut),
  setZoomFactor: (factor: number): Promise<number> => ipcRenderer.invoke('set-zoom-factor', factor),
  getZoomFactor: (): Promise<number> => ipcRenderer.invoke('get-zoom-factor'),
  // FixByAI: 暴露搜索方法给渲染进程
  searchShortcuts: (searchTerm: string): Promise<Shortcut[]> => ipcRenderer.invoke('search-shortcuts', searchTerm)
})