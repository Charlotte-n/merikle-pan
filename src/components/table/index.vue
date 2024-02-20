<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { DataItem } from '@/data/home.ts'
const props = defineProps<{
  columns: any
  data: any
  pagination?: boolean
  pageSize?: number
  extHeight: number
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
</script>

<template>
  <div>
    <a-table
      :columns="props.columns"
      :data-source="props.data"
      :row-selection="rowSelection"
      :pagination="pagination ? { pageSize: pageSize || 15 } : pagination"
      :style="{
        height: viewportWidth + 'px'
      }"
      rowClassName="my-row"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="flex justify-between">
            <div>
              {{ record.name }}
            </div>
            <div style="display: none" class="hover-v1">
              <slot name="hover"></slot>
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="scss">
.my-row {
  &:hover {
    .hover-v1 {
      display: block !important;
    }
  }
}
:global(.ant-empty) {
  height: calc(100vh - 56px - 300px);
  line-height: calc(100vh - 56px - 300px);
}
</style>
