import { expect, it, describe, vi } from 'vitest'

// 使用 vi.hoisted 确保这段代码在 vi.mock 和 import 之前执行
const { mockResourcesPath } = vi.hoisted(() => {
  ;(process as any).resourcesPath = './debug_datas'
  return {
    mockResourcesPath: './'
  }
})

// Mock electron 模块
vi.mock('electron', () => ({
  app: {
    isPackaged: true,
  },
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn()
  }
}))

import { Searcher } from '../main/utils/Searcher'
import { SettingsManager } from '../main/utils/Settings/SettingsManager'
import { Shortcut } from '../shared/Types/Shortcut'

const tests = {
  'vs': 'Visual Studio Code'
}
const testShortcuts : Shortcut[] = [{
    name: 'Visual Studio Code',
    path: 'code.exe'
}]




describe('searcher', () => {
    const sm = SettingsManager.getInstance()
    sm.checkFiles = vi.fn()
    sm.init()

    sm.shortcutSettings.shortcuts = [
        { name: 'Visual Studio Code', exec: 'code.exe' } as any
    ]

    for (let t of Object.keys(tests)) {
        it(`should search ${t}`, () => {
            expect(Searcher.getInstance().search(t, sm.shortcutSettings.shortcuts)[0].name).toBe(tests[t])         
        })
    }
})