<!--
GenByAI: 可选择列表组件（键盘导航版）
  - 支持上下箭头键循环切换选中项
  - 支持回车键打开选中项
  - 选中项自动滚动到可视区域
  - 支持鼠标点击选中
  - Props:
      items: Array<any> — 列表数据（任意结构）
      keyField: 唯一标识字段名（默认 'key'）
      nameField: 显示名称字段名（默认 'name'）
      detailField: 显示详情字段名（可选，默认 'detail'）
  - Events:
      @select(index: number) — 选中项变化时触发
      @open(index: number) — 回车键打开选中项时触发
  - 使用示例:
      <SelectableListItem :items="list" key-field="id" name-field="title" detail-field="desc" @select="onSelect" @open="onOpen" />
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  items: Array<any>
  keyField?: string
  nameField?: string
  detailField?: string
}

const props = withDefaults(defineProps<Props>(), {
  keyField: 'key',
  nameField: 'name',
  detailField: 'detail'
})

// ExplainByAI: select — 选中索引变化时触发; open — 回车键打开时触发
const emit = defineEmits<{
  (e: 'select', index: number): void
  (e: 'open', index: number): void
}>()

// ExplainByAI: 当前选中项索引，-1 表示未选中
const selectedIndex = ref(-1)
// ExplainByAI: 列表容器 DOM 引用，用于获取子元素实现自动滚动
const listRef = ref<HTMLElement | null>(null)

// ExplainByAI: 全局键盘监听
//   ArrowDown → 选中下一项（循环，到末尾回到第一项）
//   ArrowUp   → 选中上一项（循环，到开头回到最后一项）
//   Enter     → 打开当前选中项（触发 open 事件）
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (props.items.length === 0) return
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (props.items.length === 0) return
    selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (selectedIndex.value < 0) return
    emit('open', selectedIndex.value)
  }
}

function onClick(e: MouseEvent) {
  if (e.button === 0) {
    e.preventDefault()
    emit('select', selectedIndex.value)
    emit('open', selectedIndex.value)
  }
}

// ExplainByAI: 选中索引变化时
//   1. 触发 select 事件通知父组件
//   2. DOM 更新完成后，通过 children 拿到目标元素并 scrollIntoView 保证可见
watch(selectedIndex, async () => {
  emit('select', selectedIndex.value)
  await nextTick()
  const children = listRef.value?.children
  if (children && selectedIndex.value >= 0 && selectedIndex.value < children.length) {
    const el = children[selectedIndex.value] as HTMLElement
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  }
})

// ExplainByAI: 数据加载后若未选中任何项，自动选中第一项
watch(
  () => props.items.length,
  (len) => {
    if (len > 0 && selectedIndex.value === -1) {
      selectedIndex.value = 0
    }
  }
)

// ExplainByAI: 生命周期 — 在全局 window 上监听 keydown，组件销毁时移除
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('dblclick', onClick)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('dblclick', onClick)
})

// ExplainByAI: 点击列表项时设置选中索引
function selectItem(index: number) {
  selectedIndex.value = index
}
</script>

<template>
  <!-- ExplainByAI: 容器 ref 用于 watch 中获取 children 实现自动滚动 -->
  <div ref="listRef" class="selectable-list">
    <!-- ExplainByAI: 通过 keyField 取唯一标识，:class 动态绑定选中样式 -->
    <div
      v-for="(item, index) in items"
      :key="item[keyField]"
      class="selectable-list-item"
      :class="{ 'is-selected': index === selectedIndex }"
      @click="selectItem(index)"
    >
      <div class="item-info">
        <!-- ExplainByAI: 通过 nameField / detailField 动态取值显示 -->
        <span class="item-name">{{ item[nameField] }}</span>
        <span v-if="item[detailField]" class="item-detail">{{ item[detailField] }}</span>
      </div>
    </div>
  </div>
</template>
