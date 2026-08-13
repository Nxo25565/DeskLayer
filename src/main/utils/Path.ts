// path process of lnk
import { parse, join, extname } from 'path'
import { Shortcut } from '../../shared/Types/Shortcut'
import { readdirSync } from 'fs'

export function processLnkPath(path: string, importedFromFolder?: string): Shortcut {
  return {
    name: parse(path).name,
    path: path,
    importedFromFolder
  }
}

export function importFolderShortcuts(folderPath: string): Shortcut[] {
  const files = readdirSync(folderPath)
  const extensions = ['.exe', '.lnk', '.bat', '.cmd']
  const shortcuts = files
    .filter((file) => {
      return extensions.includes(extname(file))
    })
    .map((file) => {
      return processLnkPath(join(folderPath, file), folderPath)
    })
  return shortcuts
}

export function getFolders(shortcuts: Shortcut[]): string[] {
  var result:string[] = []
  shortcuts.forEach((shortcut) => {
    if (shortcut.importedFromFolder) {
      if (!result.some((folder) => folder === shortcut.importedFromFolder))
      result.push(shortcut.importedFromFolder)
    }
  })
  return result
}