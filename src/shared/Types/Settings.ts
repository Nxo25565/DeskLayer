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
  type: string,
  value: any
}
export interface ShortcutSettingOptions {
  shortcuts: Shortcut[]
  folders: string[] // cached after loaded
}



export function createDefaultGeneralSettingOption(dName="",dType="",sdefault=null): GeneralSettingOption {
  return {
    name: dName,
    type: dType,
    value: sdefault
  }
}
export function createDefaultShortcutSettings(): ShortcutSettingOptions {
  return {
    shortcuts: [],
    folders: []
  }
}


