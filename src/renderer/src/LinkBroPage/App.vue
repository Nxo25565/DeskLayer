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

async function onOpen(index: number) {
  console.log('Opening:', shortcuts.value[index])
  await window.linkbro.openShortcut(serializeShortcut(shortcuts.value[index]))
}

watch(searchText, async (newText) => {
  shortcuts.value = await window.linkbro.searchShortcuts(newText)
})

function focusSearchInput() {
  searchInput.value?.focus()
}

onMounted(async () => {
  await window.linkbro.getShortcuts()

  focusSearchInput()

  window.addEventListener('focus', focusSearchInput)
})

loadShortcuts()
</script>

<template>
  <div class="linkbro-container">
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