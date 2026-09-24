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
  tag: string,
  type: string,
  value: any
}
export interface ShortcutSettingOptions {
  shortcuts: Shortcut[]
  folders: string[] // cached after loaded
}



export function createDefaultGeneralSettingOption(dName="",dType="",sdefault=null,dTag=""): GeneralSettingOption {
  return {
    name: dName,
    tag: dTag,
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


