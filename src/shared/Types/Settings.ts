export interface Shortcut {
  name: string
  path: string
  importedFromFolder?: string // id to map it to a folder
}

export function isShortcutEqual(a: Shortcut, b: Shortcut) {
  return a.name === b.name && a.path === b.path
}

export function serializeShortcut(shortcut: Shortcut): any {
  return {
    name: shortcut.name,
    path: shortcut.path,
    importedFromFolder: shortcut.importedFromFolder
  }
}
export interface GeneralSettingOption { 
  name: string,
  type: string
}
export interface ShortcutSettingOptions {
  shortcuts: Shortcut[]
  folders: string[] // cached after loaded
}


/*
Type:

number
text
bool
list
detailed_list

*/
export function createDefaultGeneralSettingOption(dName="",dType=""): GeneralSettingOption {
  return {
    name: dName,
    type: dType
  }
}
export function createDefaultShortcutSettings(): ShortcutSettingOptions {
  return {
    shortcuts: [],
    folders: []
  }
}


