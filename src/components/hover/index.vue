<script setup lang="ts">
import type { HoverProps } from '@/components/hover/index.ts'
const props = defineProps<HoverProps>()
const emits = defineEmits<{
  share1?: [void] // 具名元组语法
  del?: [void]
  edit?: [void]
  move?: [void]
  link?: [void]
  cancel?: [void]
  revert?: [void]
}>()
</script>

<template>
  <div class="flex space-x-1">
    <div
      class="pr-[5px] text-[12px] text-[#06A7FF] cursor-pointer"
      v-for="item in props.data"
      :key="item.key"
      @click="emits(item.icon)"
    >
      <i :class="'iconfont  text-[12px] icon-' + item.icon"></i>
      {{ item.text }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
