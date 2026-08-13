<!--
GenByAI: 通用列表项组件
  - 展示名称和可选详情，带移除按钮
  - Props:
      name: 显示名称（必填）
      detail: 显示详情（可选）
  - Events:
      @remove: 点击 Remove 按钮时触发
  - 使用示例:
      <ListItem v-for="item in items" :name="item.name" :detail="item.path" @remove="onRemove" />
-->
<script setup lang="ts">
interface Props {
  name: string
  detail?: string
}

const props = defineProps<Props>()

// ExplainByAI: 移除事件，父组件监听后执行删除逻辑
const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <!-- ExplainByAI: 横向布局，左侧信息区 + 右侧移除按钮 -->
  <div class="list-item">
    <div class="item-info">
      <!-- ExplainByAI: 名称始终显示 -->
      <span class="item-name">{{ name }}</span>
      <!-- ExplainByAI: 详情可选，有值才显示 -->
      <span v-if="detail" class="item-detail">{{ detail }}</span>
    </div>
    <!-- ExplainByAI: 点击按钮触发 remove 事件 -->
    <button class="remove-btn" @click="emit('remove')">Remove</button>
  </div>
</template>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.item-detail {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.remove-btn {
  margin-left: 12px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
