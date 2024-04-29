<script setup lang="ts">
import CommonFileHeader from '@/views/ShareFile/c-pages/components/header/CommonFileHeader.vue'
import { WebsocketProvider } from 'y-websocket'
//@ts-ignore
import Quill from 'quill'
import { QuillBinding } from 'y-quill'
import * as Y from 'yjs'
import { onMounted, onUnmounted, ref } from 'vue'
import { GetFileContentApi, UpdateFileContentApi } from '@/apis/commonFile.ts'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useCommonShareFileStore } from '@/stores/commonShareFile.ts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { CATEGORY } from '@/data/common-file.ts'
import { useUserInfo } from '@/stores/userInfo.ts'

const useCommonStore = useCommonShareFileStore()
const title = ref('')
const content = ref('')
const isEdit = ref(true)
const userId = ref('')
const userStore = useUserInfo()
const route = useRoute()
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 字体
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // 样式标题
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // 下标、上标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ direction: 'rtl' }],

  [{ size: ['small', false, 'large', 'huge'] }], // 字体
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ['clean'] // 格式清除
]
const options = ref({
  debug: 'info',
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: '请输入内容',
  theme: 'snow'
})
//#region 获取文档内容

const getFileContent = async () => {
  const res = await GetFileContentApi(route.params.id as string)
  title.value = res.data.title
  content.value = res.data.content
  isEdit.value = res.data.edit
  userId.value = res.data.userId
}
//#endregion

//#region 更新数据库的内容(使用webSocket实时传输)
const updateFileContent = () => {
  const param = ref<{ id: string; content: string }>({
    id: route.params.id as string,
    content: ''
  })
  UpdateFileContentApi(param.value)
}
//#endregion
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

//创建不同的quill文档编辑器
const quills = ref({})
const ytextInstance = ref<any>({})
const providerInstance = ref<any>({})
// 在需要显示文档编辑器的地方，根据文档 ID 创建或获取对应的 Quill 实例
function createQuillForDocument(documentId: string) {
  if (!(quills.value as any)[documentId]) {
    // 如果该文档尚未有对应的 Quill 实例，创建新的 Quill 编辑器
    const quill = new Quill(`#editor-container-${documentId}`, options.value)
    ;(quills.value as any)[documentId] = quill
    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider('ws://localhost:1234', documentId, ydoc)
    const ytext = ydoc.getText('quill')
    console.log(ytext)
    const binding = new QuillBinding(ytext, quill, provider.awareness)

    // 将 Quill 编辑器和 Yjs 实例存储到 ref 中
    ;(quills.value as any)[documentId] = quill
    ;(ytextInstance.value as any)[documentId] = ytext
    ;(providerInstance.value as any)[documentId] = provider
  }
  return (quills.value as any)[documentId]
}
onMounted(async () => {
  const id = route.params.id as string
  let quill = createQuillForDocument(id)
  const textArea = document.createElement('textarea')
  // 从本地存储获取数据库内容，如果不存在则从数据库获取并设置到 Quill 编辑器中
  let delta
  await getFileContent()
  quill.enable(userId.value === userStore.userInfo._id ? true : isEdit.value)
  await quill.setText('')
  delta = content.value
  quill.setContents(delta)
  //提前渲染数据
  let timeId: any = null
  // function debounce(func: any, delay: number) {
  //   return function () {
  //     if (timeId) {
  //       clearTimeout(timeId)
  //     }
  //     timeId = setTimeout(() => {
  //       func()
  //     }, delay)
  //   }
  // }
  ytextInstance.value[route.params.id as any].observe((event: any) => {
    const delta = quill.getContents()
    useCommonStore.changeInnerHtmlContent(delta)
    textArea.value = ytextInstance.value[route.params.id as any].toString()
    // debounce(() => {
    providerInstance.value[route.params.id as any].ws?.send(
      JSON.stringify({
        event: 'events', // 注意加 event 要不然 service 的 subscriber 不生效,很重要
        data: {
          delta: quill.getContents(),
          id: route.params.id
        }
      })
    )
    // }, 1000)()
  })
  //检测text-change的变化获取delta
  quill.on('text-change', (delta: any, oldDelta: any) => {
    console.log(delta, oldDelta)
  })
  providerInstance.value[route.params.id as any].ws!.addEventListener('open', function () {
    console.log('websocket打开了')
  })

  providerInstance.value[route.params.id as any].ws?.addEventListener('close', function () {
    console.log('websocket关闭了')
  })

  textArea.addEventListener('input', () => {
    ytextInstance.value[route.params.id as any].insert(
      textArea.value.length - 1,
      textArea.value.slice(-1)
    )
  })
})
</script>

<template>
  <header>
    <CommonFileHeader
      :title="title"
      :exportPdf="exportPdf"
      :category="CATEGORY.PDF"
    ></CommonFileHeader>
  </header>
  <!--  引入文件编辑器-->
  <div
    :id="'editor-container-' + route.params.id"
    ref="editor"
    style="height: calc(100vh - 110px)"
  ></div>
</template>

<style scoped lang="scss">
#editor {
  height: calc(100vh - 100px);
  width: 50%;
  margin: auto;
}
</style>
