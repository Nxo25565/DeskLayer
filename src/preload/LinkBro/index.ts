import { contextBridge, ipcRenderer } from 'electron'
import type { Shortcut } from '../../shared/Types/Shortcut'
import type { GeneralSettingOption } from '../../shared/Types/Settings'

contextBridge.exposeInMainWorld('linkbro', {
  getShortcuts: (): Promise<Shortcut[]> => ipcRenderer.invoke('settings:get-shortcuts'),
  openShortcut: (shortcut: any): Promise<void> => ipcRenderer.invoke('open-shortcut', shortcut),
  setZoomFactor: (factor: number): Promise<number> => ipcRenderer.invoke('set-zoom-factor', factor),
  getZoomFactor: (): Promise<number> => ipcRenderer.invoke('get-zoom-factor'),
  // FixByAI: 暴露搜索方法给渲染进程
  searchShortcuts: (searchTerm: string): Promise<Shortcut[]> =>
    ipcRenderer.invoke('search-shortcuts', searchTerm),


})

contextBridge.exposeInIsolatedWorld(1024, 'lbAnimation',{
  onPlayShowAnimation: (callback: () => void) => ipcRenderer.on('animation: lbwindow-show', callback),
  onPlayHideAnimation: (callback: () => void) => ipcRenderer.on('animation: lbwindow-hide', callback),
})

contextBridge.exposeInIsolatedWorld(1024, 'settings',{
  getGeneral: (): Promise<GeneralSettingOption[]> => { return {...ipcRenderer.invoke('settings:get-general')} },
  getGeneralOption: (option: string): Promise<any> => ipcRenderer.invoke('settings:get-general-option', option),
})