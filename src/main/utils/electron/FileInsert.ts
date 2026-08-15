import { app, BrowserWindow } from "electron"
import { readFile } from "fs/promises"
import { join } from "path"


export interface InsertCustomFileOptions{
  path: string,
  priority: number
}

var defaultInserts: InsertCustomFileOptions[]

console.log(process.cwd())

const basePath = !app.isPackaged ? '../../../../resources' : './resources'

export async function loadCustomJS(window: BrowserWindow,insertJS: InsertCustomFileOptions[]) {
    try {
      insertJS = insertJS.sort((a,b) => a.priority - b.priority)
      for (const js of insertJS){
        window.webContents.executeJavaScript(await readFile(join(basePath,js.path),'utf-8'))
      }
    } catch (error) {
      console.log('An error occurred when load js')
      console.log(error)
    } 
  }

export async function loadCustomStyle(window: BrowserWindow,insertStyle: InsertCustomFileOptions[]){
    try {
      insertStyle = insertStyle.sort((a,b) => a.priority - b.priority)
      for (const css of insertStyle){
        window.webContents.executeJavaScript(await readFile(join(basePath,css.path),'utf-8'))
      }
    } catch (error) {
      console.log('An error occurred when load js')
      console.log(error)
    } 
}

export async function insertWebFiles(window: BrowserWindow,insert: InsertCustomFileOptions[]){
  insert = insert.sort((a,b) => a.priority - b.priority)
  loadCustomJS(window,insert.filter(f => f.path.endsWith('.js')))
  loadCustomStyle(window,insert.filter(f => f.path.endsWith('.css')))
}

export async function getDefaultInsert(){
  if (defaultInserts) { return defaultInserts }
  defaultInserts = JSON.parse(await readFile(join(basePath,'defaultInsert.json'),'utf-8')) as InsertCustomFileOptions[]
  return defaultInserts
}