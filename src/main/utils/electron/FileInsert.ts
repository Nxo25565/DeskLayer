import { app, WebSource } from 'electron'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { globSync } from 'fast-glob'
import { WindowManager } from './WindowManage'

export interface InsertCustomFileOptions {
  path: string
  priority: number
}

var defaultInserts: InsertCustomFileOptions[]
var rendererFileList: any
var wm: WindowManager
var injectMap = new Map<string, string | undefined>()   // windowname - csskey

app.on('ready', () => {
  defaultInserts = getDefaultInsert()
  wm = WindowManager.getInstance()
})


console.log(process.cwd())

const basePath = !app.isPackaged ? join(process.cwd(), './resources') : join(process.resourcesPath, './app.asar.unpacked/resources')
console.log('resources path: ', resolve(basePath))
console.log('packaged',join(process.cwd(), './resources/app.asar.unpacked/resources'))

export function loadCustomJS(windowName: string, insertJS: InsertCustomFileOptions[]) {
  insertJS = insertJS.sort((a, b) => a.priority - b.priority)
  const webSource = insertJS.map((f) => ({
      code: readFileSync(resolve(basePath, f.path), 'utf-8'),
      url: resolve(basePath, f.path)
    })) as WebSource[]
  try {
    wm.getWindow(windowName)?.webContents?.executeJavaScriptInIsolatedWorld(
      1024,
      webSource
    )
    console.log('load js: ' + webSource.map((f) => f.url).toString() + ' on window: ' + windowName)
  } catch (error) {
    console.log('An error occurred when load js: ' + join(basePath, [...insertJS.map((f) => f.path)].toString()))
    console.log(error)
  }
}


export async function loadCustomStyle(windowName: string, insertStyle: InsertCustomFileOptions[]) {
  insertStyle = insertStyle.sort((a, b) => a.priority - b.priority)
  for (const css of insertStyle) {
    try {
      // FixByAI: css粘代码executejs也是神人
      const key = await wm.getWindow(windowName)?.webContents.insertCSS(readFileSync(join(basePath, css.path), 'utf-8'))
      injectMap.set(windowName, key)
      console.log('load css: ' + join(basePath, css.path) + 'on window: ' + windowName)
    } catch (error) {
      console.log('An error occurred when load css: ' + join(basePath, css.path))
      console.log(error)
    }
  }
}

export async function insertWebFiles(windowName: string, insert: InsertCustomFileOptions[]) {
  insert = insert.concat(getDefaultInsert()).sort((a, b) => a.priority - b.priority)

  loadCustomJS(
    windowName,
    insert.filter((f) => f.path.endsWith('.js'))
  )
  await loadCustomStyle(
    windowName,
    insert.filter((f) => f.path.endsWith('.css'))
  )
}

export function getDefaultInsert(): InsertCustomFileOptions[] {
  // 缓存
  if (defaultInserts) {
    return defaultInserts
  }

  // 解析default.json
  defaultInserts = JSON.parse(
    readFileSync(join(basePath, 'default.json'), 'utf-8')
  ) as InsertCustomFileOptions[]
  // 解包glob-star路径
  for (const insert of defaultInserts) {
    const files = globSync(insert.path, { cwd: basePath, absolute: false, onlyFiles: true })
    if (files.length == 0) {
      // 不是glob-star路径，直接添加
      continue
    }
    // 是glob-star路径，解包，移除原始路径
    for (const file of files) {
      defaultInserts.push({
        path: file,
        priority: insert.priority
      })
    }
    defaultInserts.splice(defaultInserts.indexOf(insert), 1)
  }
  console.log('filtered default: '+[...defaultInserts.filter(f => f.priority != -1)].toString())
  return defaultInserts.filter(f => f.priority != -1)
}


export function getWebFileList(windowName: string): InsertCustomFileOptions[] {
  if (!rendererFileList) {
    // 缓存
    rendererFileList = JSON.parse(readFileSync(join(basePath, 'RendererFileList.json'), 'utf-8'))
  }
  console.log('filtered: '+parseInsertOptions(rendererFileList[windowName]).filter(f => f.priority == -1))
  return parseInsertOptions(rendererFileList[windowName]).filter(f => f.priority != -1)
}

function parseInsertOptions(jsonList: any[]): InsertCustomFileOptions[] {
  return jsonList.map((item: any) => ({
    path: item.path,
    priority: item.priority
  }))
}

export function reloadStyle(windowName: string) {
  if (injectMap.has(windowName)) {
    wm.getWindow(windowName)?.webContents?.removeInsertedCSS(injectMap.get(windowName)!)
    loadCustomStyle(
      windowName,
       [...getDefaultInsert(), ...getWebFileList(windowName)].sort((a, b) => a.priority - b.priority)
    )
  }
}