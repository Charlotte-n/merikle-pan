<script setup lang="ts">
import { CycleColumn, CycleHoverData } from '@/data/cycle.js'

const revert = () => {}
const del = () => {}
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <div class="mb-[20px]">
      <a-button class="mr-[10px] bg-[#67C23A] text-white border-white" style="line-height: 1">
        <template #icon>
          <span class="iconfont icon-revert mr-[5px]"></span>
        </template>
        还原
      </a-button>
      <a-button danger type="primary">
        <template #icon>
          <span class="iconfont icon-del mr-[5px] text-[13px]"></span>
        </template>
        批量删除
      </a-button>
    </div>
    <MyTable data="" :ext-height="78" :columns="CycleColumn">
      <Hover :data="CycleHoverData" @revert="revert" @del="del"></Hover>
    </MyTable>
  </div>
</template>

<style scoped lang="scss"></style>
