import type { Shortcut } from "./Shortcut"
/*
Type:

number
text
bool
list
detailed_list

*/
export interface GeneralSettingOption { 
  name: string,
  type: string
}
export interface ShortcutSettingOptions {
  shortcuts: Shortcut[]
  folders: string[] // cached after loaded
}



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


