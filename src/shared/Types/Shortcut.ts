export interface Shortcut{
    name: string,
    path: string,
    importedFromFolder?: string,    // id to map it to a folder
}

export function isShortcutEqual(a:Shortcut, b:Shortcut){
    return a.name === b.name && a.path === b.path;
}