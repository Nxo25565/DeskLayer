<script setup lang="ts">
import { ref } from 'vue'
import DragScroll from '../shared/components/DragScroll.vue'
import ListItem from '../shared/components/ListItem.vue'
import { Shortcut } from '../../../shared/Types/Shortcut'
import { onMounted } from 'vue'
import GeneralSettingsViewer from './GeneralSettingsViewer.vue'

var isOpenFileDialog = false

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
  window.settings.removeSingleShortcut({ ...shortcuts.value[index] })
  shortcuts.value.splice(index, 1)
  window.settings.save()
}

function addMultiShortcuts(newShortcuts: Shortcut[]) {
  for (const shortcut of newShortcuts) {
    if (!shortcuts.value.some((s) => s.path === shortcut.path)) {
      shortcuts.value.unshift(shortcut)
    }
  }
  window.settings.addMultipleShortcuts(newShortcuts)
  window.settings.save()
}

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
  
  <DragScroll :min-height="500" class="settings-container">
    
    <div>
      <div id="shortcut-title">
        <p class="title2-zh">快捷方式管理</p>
        <p class="title2-eng">Shortcuts Manage</p>
      </div>
      <div id="shortcut-title">
        <p class="title3-zh">快捷方式</p>
        <p class="title3-eng">Shortcuts</p>
      </div>
      <DragScroll>
        <ListItem
          v-for="(shortcut, index) in shortcuts"
          :key="shortcut.path"
          :name="shortcut.name"
          :detail="shortcut.path"
          @remove="removeShortcut(index)"
        />
      </DragScroll>
      <div id="folder-title">
        <p class="title3-zh">文件夹</p>
        <p class="title3-eng">Folders</p>
      </div>
      <DragScroll>
        <ListItem
          v-for="(folder, index) in folders"
          :key="folder"
          :name="folder"
          @remove="removeFolder(index)"
        />
      </DragScroll>
      <div class="add-button-collection">
        <button @click="importSingleShortcut" class="add-btn">
          <p class="content-zh">导入单个 Import Single</p>
        </button>
        <button @click="importFolderShortcut" class="add-btn">
          <p class="content-zh">导入文件夹 Import Folder</p>
        </button>
      </div>
      <div id="shortcut-title" style="margin-top: 8px;">
        <p class="title2-zh">一般设置</p>
        <p class="title2-eng">General</p>
      </div>
      <hr>
      <GeneralSettingsViewer />
    </div>
  <div>
      <div id="shortcut-title">
        <p class="title2-zh">其他</p>
        <p class="title2-eng">Others</p>
      </div>
    <button @click="openAboutWin">About DeskLayer</button>
  </div>
  </DragScroll>
  <div id="settings-title">
    <p id="settings-title-zh">设置</p>
    <p id="settings-title-eng">Settings</p>
  </div>
</template>