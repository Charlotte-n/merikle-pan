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

const route = useRoute()
let quill: any
const title = ref('')
const isEdit = ref(true)
const userId = ref('')
const editor = ref()
const img = ref('')
const cursors = ref<any>({}) //存储光标

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

//更新光标
const updateCursor = (clientId: number, user: { name: string; color: string }, index: number) => {
  const quillEditor = quill.quill
  if (!cursors.value[clientId]) {
    //创建一个光标
    const span = document.createElement('span')
    span.classList.add('ql-cursor')
    span.innerHTML = `
      <span class="ql-cursor-flag">
        <span class="ql-cursor-name"></span>
      </span>
      <span class="ql-cursor-caret"></span>
    `
    cursors.value[clientId] = quillEditor.addContainer('ql-cursor-container')
    cursors.value[clientId].appendChild(span)
  }

  //更新光标的样式和位置
  // 更新光标位置和样式
  if (index) {
    const cursor = cursors.value[clientId]
    const bounds = quillEditor.getBounds(index)
    cursor.style.left = bounds.left + 'px'
    cursor.style.top = bounds.top + 'px'
    cursor.style.height = bounds.height + 'px'
    cursor.querySelector('.ql-cursor-name').textContent = user.name
    cursor.querySelector('.ql-cursor-name').style.color = user.color
    cursor.querySelector('.ql-cursor-caret').style.backgroundColor = user.color
    cursor.style.display = 'block'
  } else {
    cursors.value[clientId].style.display = 'none'
  }
}

//删除光标
const deleteCursor = (clientId: number) => {
  const cursor = cursors.value[clientId]
  if (cursor) {
    cursor.remove()
    delete cursors.value[clientId]
  }
}

onMounted(() => {
  let { id } = route.params

  quill = new MyQuill('#editor-container')
  quill.focus()

  //处理版本信息
  setTimeout(() => {
    getFileContent(id as string, quill)
  }, 100)

  //创建一个roomName
  new MyYjs(quill, id as string, 'merikle', updateCursor, deleteCursor)
})
</script>

<template>
  <header class="mb-[15px]">
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

<style lang="scss">
#editor {
  height: calc(100vh - 100px);
  width: 50%;
  margin: auto;
}

.ql-cursor-container {
  position: absolute;
  pointer-events: none;
  z-index: 1000;
}
.ql-cursor-caret {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  margin-left: -1px;
  height: 100%;
}
.ql-cursor-flag {
  position: absolute;
  left: -10px;
  padding: 2px 4px;
  border-radius: 2px;
  opacity: 1 !important;
  visibility: visible !important;
}
</style>
