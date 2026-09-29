import { expect, it, describe, vi, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { InsertCustomFileOptions, getWebFileList, getDefaultInsert } from '../../main/utils/electron/FileInsert'
import path from 'path'

const mockRendererFileList = {
  'main-window': [
    { path: 'custom-script.js', priority: 1 },
    { path: 'custom-style.css', priority: 2 },
    { path: 'disabled-file.js', priority: -1 },
    
  ],
  'settings-window': [
    { path: 'settings-script.js', priority: 3 }
  ]
}

vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    on: vi.fn()
  },
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn()
  }
}))

vi.mock('fs', () => ({
  readFileSync: vi.fn((filePath: string) => {
    if (filePath.includes('RendererFileList.json')) {
      return JSON.stringify(mockRendererFileList)
    }
    if (filePath.includes('default.json')) {
      return JSON.stringify([
        { path: 'js/libs/**/*.js', priority: 0 },
        { path: 'js/animejsTest.js', priority: -1 }
      ])
    }
    return ''
  })
}))

vi.mock('fast-glob', () => ({
  globSync: vi.fn((pattern: string, options: any) => {
    if (pattern.includes('**')) {
      return ['js/libs/lib1.js', 'js/libs/subdir/lib2.js']
    }
    return []
  })
}))

describe('getWebFileList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GenByAI: 应该正确解析glob-star路径', () => {
    const result = getDefaultInsert()
    
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'js/libs/lib1.js', priority: 0 }),
        expect.objectContaining({ path: 'js/libs/subdir/lib2.js', priority: 0 })
      ])
    )
    
    const hasGlobPattern = result.some(item => item.path.includes('**'))
    expect(hasGlobPattern).toBe(false)
    
    const hasDisabledFile = result.some(item => item.path === 'js/animejsTest.js')
    expect(hasDisabledFile).toBe(false)
  })

  it('GenByAI: 应该返回指定窗口的文件列表并过滤掉priority为-1的项', () => {
    const result = getWebFileList('main-window')
    
    expect(result).toEqual([
      { path: 'custom-script.js', priority: 1 },
      { path: 'custom-style.css', priority: 2 }
    ])
  })

  it('GenByAI: 当窗口名不存在时应该抛出错误', () => {
    expect(() => getWebFileList('non-existent-window')).toThrow()
  })

  it('GenByAI: 应该正确返回只有一个文件的窗口列表', () => {
    const result = getWebFileList('settings-window')
    
    expect(result).toEqual([
      { path: 'settings-script.js', priority: 3 }
    ])
  })

  it('GenByAI: 应该过滤掉所有priority为-1的文件', () => {
    const result = getWebFileList('main-window')
    
    const hasNegativePriority = result.some(item => item.priority === -1)
    expect(hasNegativePriority).toBe(false)
  })

  it('GenByAI: 返回的结果应该符合InsertCustomFileOptions类型', () => {
    const result = getWebFileList('main-window')
    
    result.forEach(item => {
      expect(item).toHaveProperty('path')
      expect(item).toHaveProperty('priority')
      expect(typeof item.path).toBe('string')
      expect(typeof item.priority).toBe('number')
    })
  })
})