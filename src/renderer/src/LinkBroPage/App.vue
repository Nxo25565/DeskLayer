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
  <div class="linkbro-container">
    <!-- FixByAI: +号网格背景容器（由注入脚本dotGenerate.js自动填充） -->
    <div class="plus-grid-background"></div>

    <h1 class="header">DESKLAYER a0.0.1 awa</h1>

    <div class="search-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        ref="searchInput"
        type="text"
        v-model="searchText"
        placeholder="Type to search"
        class="search-input"
      />
    </div>

    <DragScroll :height="500" :min-height="500" :max-height="500" class="shortcut-list-container">
      <SelectableListItem
        :items="shortcuts"
        key-field="path"
        name-field="name"
        detail-field="path"
        @select="onSelect"
        @open="onOpen"
      />
    </DragScroll>
  </div>
</template>