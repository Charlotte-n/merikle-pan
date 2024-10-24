<script setup lang="ts">
import CommonFileHeader from '@/views/ShareFile/c-pages/components/header/CommonFileHeader.vue'
//@ts-ignore
import { onMounted, ref } from 'vue'
import { GetFileContentApi, UpdateFileContentApi, GetFileInfoApi } from '@/apis/commonFile'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { CATEGORY } from '@/data/common-file'
import { MyQuill } from './utils/quill'
import { MyYjs } from './utils/Yjs'

let quill: any
const title = ref('')
const isEdit = ref(true)
const userId = ref('')
const route = useRoute()

const editor = ref()
const img = ref('')
//#region 转化为pdf
const exportPdf = () => {
  html2canvas(editor.value).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const doc = new jsPDF('p', 'mm')
    const imgWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    img.value = imgData
    let position = 0
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    //文件的保存
    doc.save(title.value ? title.value : '')
  })
}
//#endregion

//保存文件
const saveFile = async (c: any) => {
  let content = JSON.stringify(JSON.parse(c).ops).toString()
  let fileId = route.params.id as string
  let res = await UpdateFileContentApi({ content, fileId })
  if (res.code !== 0) console.log('保存失败')
}
//#region 获取文档信息
const getFileInfo = async (fileId: string) => {
  const res = await GetFileInfoApi(fileId)
  title.value = res.data.title
  isEdit.value = res.data.edit
  userId.value = res.data.userId
}
//#endregion

//#region 获取文档内容
const getFileContent = async (fileId: string, quill: any) => {
  let { ops } = quill.getDetail()
  if (ops[0].insert !== '\n') return
  const result = await GetFileContentApi(fileId as string)
  if (result.code === 0) quill.init(result.data.content[0])
}
//#endregion

onMounted(() => {
  let { id } = route.params
  //获取文档信息
  getFileInfo(id as string)
  quill = new MyQuill('#editor-container')
  quill.focus()
  //处理版本信息
  setTimeout(() => {
    getFileContent(id as string, quill)
  }, 100)
  const yjs = new MyYjs(quill, id as string)
})
</script>

<template>
  <header>
    <CommonFileHeader
      @saveFile="saveFile"
      :title="title"
      :exportPdf="exportPdf"
      :category="CATEGORY.PDF"
      :quill="quill"
    ></CommonFileHeader>
  </header>
  <!--  引入文件编辑器-->
  <div :id="`editor-container`" ref="editor" style="height: calc(100vh - 110px)"></div>
</template>

<style scoped lang="scss">
#editor {
  height: calc(100vh - 100px);
  width: 50%;
  margin: auto;
}
</style>
