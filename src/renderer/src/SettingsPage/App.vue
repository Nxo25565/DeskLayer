<script setup lang="ts">
import { ref } from 'vue'
import DragScroll from '../shared/components/DragScroll.vue'
import ListItem from '../shared/components/ListItem.vue'
import { Shortcut } from '../../../shared/Types/Shortcut'
import { onMounted } from 'vue'
import GeneralSettingsViewer from './GeneralSettingsViewer.vue'

var isOpenFileDialog = false

// const folders = ref<string[]>([
//     'C:/Users/Admin/Desktop/Games',
//     'C:/Users/Admin/Documents/Tools',
//     'D:/Work/Projects',
//     'D:/Work/Projects',
//     'D:/Work/Projects',
//     'D:/Work/Projects',
//     'D:/Work/Projects',
//     'D:/Work/Projects',
//     'D:/Work/Projects',
// ])

// var shortcuts = ref<Shortcut[]>([
//     { name: 'Chrome', path: 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
//     { name: 'VS Code', path: 'C:/Users/Admin/AppData/Local/Programs/Microsoft VS Code/Code.exe' },
//     { name: 'Steam', path: 'C:/Program Files (x86)/Steam/Steam.exe' },
//     { name: 'Notepad++', path: 'C:/Program Files/Notepad++/notepad++.exe' },
//     { name: 'Discord', path: 'C:/Users/Admin/AppData/Local/Discord/Update.exe' },
//     { name: 'Figma', path: 'C:/Users/Admin/AppData/Local/Figma/Figma.exe' },
//     { name: 'Spotify', path: 'C:/Users/Admin/AppData/Roaming/Spotify/Spotify.exe' },
//     { name: 'Postman', path: 'C:/Users/Admin/AppData/Local/Postman/Postman.exe' },
// ])

const folders = ref<string[]>([])
const shortcuts = ref<Shortcut[]>([])

async function openAboutWin() {
  await window.settings.openAboutWin()
}

function removeFolder(index: number) {
  shortcuts.value = shortcuts.value.filter((s) => s.importedFromFolder !== folders.value[index])
  window.settings.removeShortcutsByFolder(folders.value[index])
  folders.value.splice(index, 1)
}

function removeShortcut(index: number) {
  // FixByAI: 使用展开运算符剥离 Vue reactive proxy，避免 IPC 序列化失败
  window.settings.removeSingleShortcut({ ...shortcuts.value[index] })
  shortcuts.value.splice(index, 1)
  window.settings.save()
}

// FixByAI: 封装去重添加函数，根据 path 去重
function addMultiShortcuts(newShortcuts: Shortcut[]) {
  for (const shortcut of newShortcuts) {
    if (!shortcuts.value.some((s) => s.path === shortcut.path)) {
      shortcuts.value.unshift(shortcut)
    }
  }
  window.settings.addMultipleShortcuts(newShortcuts)
  window.settings.save()
}

// FixByAI: 封装文件夹去重添加函数
function addFolder(folderPath: string) {
  if (folderPath && !folders.value.includes(folderPath)) {
    folders.value.unshift(folderPath)
  }
}

async function importSingleShortcut() {
  if (isOpenFileDialog) return
  isOpenFileDialog = true
  const result = await window.settings.openImportSingleDialog()
  isOpenFileDialog = false
  if (result.canceled) {
    return
  }
  addMultiShortcuts(result)
}

async function importFolderShortcut() {
  if (isOpenFileDialog) return
  isOpenFileDialog = true
  const result = await window.settings.openImportFolderDialog()
  isOpenFileDialog = false
  if (result.failed) {
    return
  }
  addMultiShortcuts(result.shortcuts)
  addFolder(result.folderPath || '')
}

onMounted(async () => {
  shortcuts.value = await window.settings.getShortcuts()
  folders.value = await window.settings.getFolders()
})
</script>
<template>
  <h1>设置 Settings</h1>
  <div>
    <h2>快捷方式管理 Shortcuts Manage</h2>
    <button @click="importSingleShortcut">Import Single</button>
    <button @click="importFolderShortcut">Import Folder</button>
    <h3>文件夹 Folders</h3>
    <DragScroll>
      <ListItem
        v-for="(folder, index) in folders"
        :key="folder"
        :name="folder"
        @remove="removeFolder(index)"
      />
    </DragScroll>
    <h3>快捷方式 Shortcuts</h3>
    <DragScroll>
      <ListItem
        v-for="(shortcut, index) in shortcuts"
        :key="shortcut.path"
        :name="shortcut.name"
        :detail="shortcut.path"
        @remove="removeShortcut(index)"
      />
    </DragScroll>

    <h3>一般 General</h3>
    <GeneralSettingsViewer />
  </div>
  <div>
    <h2>其他 Others</h2>
    <button @click="openAboutWin">About DeskLayer</button>
  </div>
</template>
