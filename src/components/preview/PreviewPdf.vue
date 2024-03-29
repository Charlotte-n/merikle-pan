<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/style/index.css'
import { imageUrlBase } from '@/data/common.ts'

const props = defineProps({
  url: {
    type: String
  }
})
const state = reactive({
  source: props.pdfurl, //预览pdf文件地址
  pageNum: 0, //当前页面
  scale: 1, // 缩放比例
  numPages: 0 // 总页数
})
</script>

<template>
  <div>
    <VuePdfEmbed
      ref="vuePdfRef"
      :source="imageUrlBase + props.url"
      :page="state.pageNum"
      width="850"
    ></VuePdfEmbed>
  </div>
</template>

<style scoped lang="scss"></style>
