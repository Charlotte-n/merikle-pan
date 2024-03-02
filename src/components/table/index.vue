<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { DataItem } from '@/data/home.ts'
const props = defineProps<{
  columns: any
  data: any
  pagination?: boolean
  pageSize?: number
  extHeight: number
  add: boolean
}>()

const viewportWidth = ref(window.innerHeight - 56 - 20 - 50 - props.extHeight)
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
    console.log(selected, selectedRows, changeRows)
  }
})

// 定义一个处理视口变化的函数
const handleResize = () => {
  viewportWidth.value = window.innerHeight - 56 - 20 - 50 - props.extHeight
}

// 在组件挂载时添加视口变化的监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

// 在组件卸载时移除监听器，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 使用watch监听viewportWidth的变化
watch(viewportWidth, (newVal, oldVal) => {
  console.log(`Viewport width changed from ${oldVal}px to ${newVal}px`)
})
onMounted(() => {
  console.log(props.data)
})
</script>

<template>
  <div>
    <a-table
      :columns="props.columns"
      :data-source="props.data"
      :row-selection="rowSelection"
      :pagination="pagination ? { pageSize: pageSize || 15 } : pagination"
      :style="{
        maxHeight: viewportWidth + 'px'
      }"
      :scroll="{ y: viewportWidth - 60 }"
      rowClassName="my-row"
    >
      <template #bodyCell="{ column, record }">
        <slot name="bodyCell" :column="column" :record="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="scss">
:global(.ant-empty) {
  height: calc(100vh - 56px - 300px);
  line-height: calc(100vh - 56px - 300px);
}
</style>
