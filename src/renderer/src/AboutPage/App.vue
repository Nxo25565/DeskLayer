<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { VersionInfo } from '../../../shared/Types/VersionInfo'

// const deskLayerVersion = ref('')
// const electronVersion = ref('')
// const nodeVersion = ref('')
// const vueVersion = ref('')
const version = ref<VersionInfo>({
  deskLayer_ver: '',
  electron_ver: '',
  node_ver: '',
  vite_ver: ''
})
onMounted(async () => {
  version.value = await window.about.getVersion()
})
</script>
<template>
  <h1>About / Versions</h1>
  <h2>DeskLayer: {{ version.deskLayer_ver }}</h2>
  <p>Electron: {{ version.electron_ver }}</p>
  <p>Node: {{ version.node_ver }}</p>
  <p>Vue: {{ version.vite_ver }}</p>
</template>
