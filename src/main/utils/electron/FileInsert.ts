import { app, BrowserWindow } from 'electron'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { globSync } from 'fast-glob'

/*

TODO: 自定义css/js动画

- 加载自定义js文件 x
- 加载自定义css文件 x
- 解析glob-star路径
- 加载默认js/css文件

*/

export interface InsertCustomFileOptions {
  path: string
  priority: number
}

var defaultInserts: InsertCustomFileOptions[]
var rendererFileList: any

console.log(process.cwd())

const basePath = !app.isPackaged ? join(process.cwd(), './resources') : './resources'
console.log('resources path: ', resolve(basePath))

export function loadCustomJS(window: BrowserWindow, insertJS: InsertCustomFileOptions[]) {
  insertJS = insertJS.sort((a, b) => a.priority - b.priority)
  for (const js of insertJS) {
    try {
      window.webContents.executeJavaScript(readFileSync(join(basePath, js.path), 'utf-8'))
      console.log('load js: ' + join(basePath, js.path))
    } catch (error) {
      console.log('An error occurred when load js: ' + join(basePath, js.path))
      console.log(error)
    }
  }
}

export function loadCustomStyle(window: BrowserWindow, insertStyle: InsertCustomFileOptions[]) {
  insertStyle = insertStyle.sort((a, b) => a.priority - b.priority)
  for (const css of insertStyle) {
    try {
      // FixByAI: css粘代码executejs也是神人
      window.webContents.insertCSS(readFileSync(join(basePath, css.path), 'utf-8'))
      console.log('load css: ' + join(basePath, css.path))
    } catch (error) {
      console.log('An error occurred when load css: ' + join(basePath, css.path))
      console.log(error)
    }
  }
}

export function insertWebFiles(window: BrowserWindow, insert: InsertCustomFileOptions[]) {
  insert = insert.concat(getDefaultInsert()).sort((a, b) => a.priority - b.priority)

  loadCustomJS(
    window,
    insert.filter((f) => f.path.endsWith('.js'))
  )
  loadCustomStyle(
    window,
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
  return defaultInserts
}


export function getWebFileList(windowName: string): InsertCustomFileOptions[] {
  if (!rendererFileList) {
    // 缓存
    rendererFileList = JSON.parse(readFileSync(join(basePath, 'RendererFileList.json'), 'utf-8'))
  }
  return parseInsertOptions(rendererFileList[windowName])
}

function parseInsertOptions(jsonList: any[]): InsertCustomFileOptions[] {
  return jsonList.map((item: any) => ({
    path: item.path,
    priority: item.priority
  }))
}