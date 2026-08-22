<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import SelectableListItem from '../shared/components/SelectableListItem.vue'
import DragScroll from '../shared/components/DragScroll.vue'
import type { Shortcut } from '../../../shared/Types/Shortcut'
import { serializeShortcut } from '../../../shared/Types/Shortcut'

var searchText = ref<string>('')

const shortcuts = ref<Shortcut[]>([])

const searchInput = ref<HTMLInputElement | null>(null)

async function loadShortcuts() {
  shortcuts.value = await window.linkbro.getShortcuts()
}

function onSelect(index: number) {
  console.log('Selected index:', index, shortcuts.value[index])
}

// GenByAI: 回车打开选中项
async function onOpen(index: number) {
  console.log('Opening:', shortcuts.value[index])
  await window.linkbro.openShortcut(serializeShortcut(shortcuts.value[index]))
}

watch(searchText, async (newText) => {
  shortcuts.value = await window.linkbro.searchShortcuts(newText)
})

// FixByAI: 聚焦搜索输入框，供多处调用
function focusSearchInput() {
  searchInput.value?.focus()
}

onMounted(async () => {
  await window.linkbro.getShortcuts()

  // FixByAI: 首次挂载立即聚焦 input
  focusSearchInput()

  // FixByAI: 窗口每次获得焦点时（如 show/focus）都重新聚焦 input
  window.addEventListener('focus', focusSearchInput)
})

loadShortcuts()
</script>

<template>
  <h4>DESKLAYER-LINKBRO</h4>
  <input ref="searchInput" type="text" v-model="searchText" placeholder="Search" />
  <DragScroll :height="600" :min-height="600" :max-height="600">
    <SelectableListItem
      :items="shortcuts"
      key-field="path"
      name-field="name"
      detail-field="path"
      @select="onSelect"
      @open="onOpen"
    />
  </DragScroll>
</template>
