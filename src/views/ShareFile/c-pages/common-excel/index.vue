<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CommonFileHeader from '@/views/ShareFile/c-pages/components/header/CommonFileHeader.vue'
import { getFileInfoApi } from '@/apis/file.ts'
import { useRoute } from 'vue-router'
import { GetFileContentApi } from '@/apis/commonFile.ts'

const route = useRoute()

const init = () => {
  const options = {
    container: 'luckysheet',
    showinfobar: false,
    allowUpdate: true,
    loadUrl: 'http://localhost:3000/commonExcel/fetchExcelData',
    updateUrl: 'ws://localhost:2555?id=' + route.params.id
  }
  luckysheet.create(options)
}
//获取文档名字以及内容
const name = ref('')
const getFileContent = async () => {
  const res = await GetFileContentApi((route.params as any).id)
  name.value = res.data.title
}

onMounted(async () => {
  init()
  await getFileContent()
})
</script>

<template>
  <div class="h-[100vh]">
    <!--    头部-->
    <CommonFileHeader :title="name" export-pdf=""></CommonFileHeader>
    <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        height: 90%;
        left: 0px;
        top: 65px;
      "
    ></div>
  </div>
</template>

<style scoped lang="scss"></style>
