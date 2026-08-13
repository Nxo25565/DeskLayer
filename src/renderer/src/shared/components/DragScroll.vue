<!--
GenByAI: 可拖拽调整高度的滚动容器
  - 通过鼠标上下拖拽改变容器高度，支持 min/max 边界限制
  - Props:
      minHeight: 最小高度（px），默认 80
      maxHeight: 最大高度（px），默认 400
      height: 初始高度（px），不传则使用 minHeight
  - 使用示例:
      <DragScroll :min-height="100" :max-height="500" :height="300">
        <ListItem v-for="..." />
      </DragScroll>
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  minHeight?: number
  maxHeight?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: 80,
  maxHeight: 400,
  height: undefined
})

// ExplainByAI: 拖拽状态，记录起始鼠标 Y 坐标和起始高度，用于计算增量
interface DragResizeState {
  isDragging: boolean
  startY: number
  startHeight: number
  el: HTMLElement | null
}

const containerRef = ref<HTMLElement | null>(null)

// ExplainByAI: 用 ref 记录当前高度，避免内容变化时 DOM 重渲染导致高度重置
const currentHeight = ref(props.height ?? props.minHeight)

const dragState = ref<DragResizeState>({
  isDragging: false,
  startY: 0,
  startHeight: 0,
  el: null
})

// ExplainByAI: 鼠标按下时开始拖拽，记录初始位置和高度
function onMouseDown(e: MouseEvent) {
  const el = containerRef.value
  if (!el) return
  dragState.value = {
    isDragging: true,
    startY: e.clientY,
    startHeight: el.clientHeight,
    el
  }
  el.style.cursor = 'ns-resize'
  el.style.userSelect = 'none'
}

// ExplainByAI: 拖拽过程中，根据鼠标 Y 偏移计算新高度，并限制在 min~max 之间
function onMouseMove(e: MouseEvent) {
  const state = dragState.value
  if (!state.isDragging || !state.el) return
  const deltaY = e.clientY - state.startY
  const newHeight = Math.max(props.minHeight, Math.min(props.maxHeight, state.startHeight + deltaY))
  currentHeight.value = newHeight
}

// ExplainByAI: 松开鼠标结束拖拽，清除光标样式和拖拽状态
function onMouseUp() {
  const state = dragState.value
  if (state.el) {
    state.el.style.cursor = ''
    state.el.style.userSelect = ''
  }
  dragState.value = { isDragging: false, startY: 0, startHeight: 0, el: null }
}

// ExplainByAI: 全局监听鼠标移动和释放，确保拖拽时鼠标移出容器也能正常响应
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <!-- ExplainByAI: 容器绑定高度样式和 mousedown 拖拽起始事件 -->
  <div
    ref="containerRef"
    class="drag-resize-container"
    :style="{ height: currentHeight + 'px' }"
    @mousedown="onMouseDown"
  >
    <slot />
  </div>
</template>

<style scoped>
.drag-resize-container {
  margin-top: 8px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  cursor: ns-resize;
}
</style>
