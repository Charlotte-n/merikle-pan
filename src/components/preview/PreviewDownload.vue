<script setup lang="ts">
import Icon from '@/components/icon/index.vue'
import { imageUrlBase } from '@/data/common.ts'
const props = defineProps<{
  fileInfo: any
}>()
//一种下载文件的方法
const download = () => {
  window.location.href = imageUrlBase + props.fileInfo.fileCover
}
</script>

<template>
  <div>
    <div class="mt-[20px]">
      <Icon :file-type="9" width="80" height="80"></Icon>
      <div>{{ fileInfo.name }}</div>
      <div class="mt-[20px]">
        <a-button type="primary" @click="download">下载 {{ fileInfo.size.toFixed(2) }}</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
