<script setup lang="ts">
import { HomeHoverData } from '@/data/home'
const props = defineProps<{
  fileInfo: any
  data: any
  type?: number
}>()
const emit = defineEmits<{
  share1?: [void] // 具名元组语法
  del?: [void]
  edit?: [void]
  move?: [void]
  link?: [void]
  cancel?: [void]
  revert?: [void]
  download?: [void]
}>()
</script>

<template>
  <div class="flex space-x-1">
    <div
      class="pr-[5px] text-[12px] text-[#06A7FF] cursor-pointer"
      v-for="item in data.slice(0, type ? data.length : data.length - 1)"
      :key="item.key"
      @click="
        () => {
          ;(emit as any)(item.icon as any)
        }
      "
    >
      <i :class="'iconfont  text-[12px] icon-' + item.icon"></i>
      {{ item.text }}
    </div>
    <div
      v-if="fileInfo.folder_type === 0"
      class="pr-[5px] text-[12px] text-[#06A7FF] cursor-pointer"
      @click="
        () => {
          emit('download')
        }
      "
    >
      <i :class="'iconfont  text-[12px] icon-download'"></i>
      {{ HomeHoverData[HomeHoverData.length - 1].text }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
