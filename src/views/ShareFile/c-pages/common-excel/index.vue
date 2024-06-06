<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CommonFileHeader from '@/views/ShareFile/c-pages/components/header/CommonFileHeader.vue'
import { useRoute } from 'vue-router'
import { GetFileInfoApi } from '@/apis/commonFile.ts'
import { CATEGORY } from '@/data/common-file.ts'
import { exportJs } from '@/util/luckysheet/export.ts'
import { useUserInfo } from '@/stores/userInfo.ts'

const route = useRoute()
const edit = ref(true)
const userStore = useUserInfo()
const userId = ref('')
const fetchExcelData = async () => {
  const res = await GetFileInfoApi(route.params.id as string)
  edit.value = res.data.edit
  userId.value = res.data.userId
}

const init = () => {
  const options = {
    container: 'luckysheet',
    showinfobar: false,
    allowUpdate: true,
    loadUrl: 'http://localhost:3000/commonExcel/fetchExcelData?id=' + route.params.id,
    updateUrl: 'ws://localhost:2575?id=' + route.params.id,
    allowEdit: userStore.userInfo._id === userId.value ? true : edit.value
  }
  luckysheet.create(options)
}
//获取文档名字以及内容
const name = ref('')
const getFileContent = async () => {
  const res = await GetFileInfoApi((route.params as any).id)
  name.value = res.data.title
}
//导出excel(下载excel)
const exportExcel = () => {
  exportJs(window.luckysheet.getAllSheets(), '下载')
}
onMounted(async () => {
  await fetchExcelData()
  init()
  await getFileContent()
})
</script>

<template>
  <div class="h-[100vh]">
    <!--    头部-->
    <CommonFileHeader
      :title="name"
      :export-excel="exportExcel"
      :category="CATEGORY.EXCEL"
    ></CommonFileHeader>
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
