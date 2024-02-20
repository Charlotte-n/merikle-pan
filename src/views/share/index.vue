<script setup lang="ts">
import { StopOutlined } from '@ant-design/icons-vue'
import { shareColume, ShareData, ShareHoverData } from '@/data/share.ts'
import Hover from '@/components/hover/index.vue'
const link = () => {
  console.log('复制链接')
}
const cancel = () => {
  console.log('取消分享')
}
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <div>
      <a-button type="primary">
        <template #icon>
          <StopOutlined />
        </template>
        取消分享
      </a-button>
    </div>
    <div class="mt-[10px] mb-[15px] text-[#636D7E] text-[13px]" style="font-weight: 800">
      全部文件
    </div>
    <MyTable :data="ShareData" :ext-height="77" :columns="shareColume" pagination>
      <template #hover>
        <Hover :data="ShareHoverData" @cancel="cancel" @link="link"></Hover>
      </template>
    </MyTable>
  </div>
</template>

<style scoped lang="scss"></style>
