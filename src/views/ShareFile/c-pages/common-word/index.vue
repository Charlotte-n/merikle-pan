<script setup lang="ts">
import CommonFileHeader from '@/views/ShareFile/c-pages/components/header/CommonFileHeader.vue'
import { WebsocketProvider } from 'y-websocket'
//@ts-ignore
import Quill from 'quill'
import { QuillBinding } from 'y-quill'
import * as Y from 'yjs'
import { onMounted, ref } from 'vue'
import { GetFileContentApi, UpdateFileContentApi } from '@/apis/commonFile.ts'
import router from '@/router'
import { useRoute } from 'vue-router'

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
const options = {
  debug: 'info',
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: '请输入内容',
  theme: 'snow'
}

//#region 获取文档内容
const title = ref('')
const content = ref('')
const getFileContent = async () => {
  const res = await GetFileContentApi(route.params.id as string)
  title.value = res.data.title
  content.value = res.data.content
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

onMounted(async () => {
  const quill = new Quill('#editor', options)
  const ydoc = new Y.Doc() // y 文档对象，保存需要共享的数据
  const ytext = ydoc.getText('quill') // 创建名为 quill 的 Text 对象
  const provider = new WebsocketProvider('ws://localhost:1234', '', ydoc)
  const binding = new QuillBinding(ytext, quill, provider.awareness) // 数据模型绑定
  const textArea = document.createElement('textarea')
  // 从本地存储获取数据库内容，如果不存在则从数据库获取并设置到 Quill 编辑器中
  let delta
  let contentFromDatabase = localStorage.getItem('quillContent')
  await getFileContent()
  //提前渲染数据
  if (!contentFromDatabase) {
    // 模拟从数据库获取内容
    contentFromDatabase = content.value
    localStorage.setItem('quillContent', JSON.stringify(contentFromDatabase))
    delta = JSON.parse(content.value)
    quill.setContents(delta)
  } else {
    if (content.value !== contentFromDatabase) {
      localStorage.setItem('quillContent', JSON.stringify(content.value))
      const delta = content.value
      quill.setContents(delta)
    } else {
      quill.setContents(JSON.parse(contentFromDatabase))
    }
  }
  let timeId: any = null
  function debounce(func: any, delay: number) {
    return function () {
      if (timeId) {
        clearTimeout(timeId)
      }
      timeId = setTimeout(() => {
        func()
      }, delay)
    }
  }
  ytext.observe((event) => {
    textArea.value = ytext.toString()
    debounce(() => {
      provider.ws?.send(
        JSON.stringify({
          event: 'events', // 注意加 event 要不然 service 的 subscriber 不生效,很重要
          data: {
            delta: quill.getContents(),
            id: route.params.id
          }
        })
      )
    }, 1000)()
  })
  //检测text-change的变化获取delta
  quill.on('text-change', (delta: any, oldDelta: any) => {
    console.log(delta, oldDelta)
  })
  provider.ws!.addEventListener('open', function () {
    console.log('websocket打开了')
  })

  provider.ws?.addEventListener('close', function () {
    console.log('websocket关闭了')
  })

  textArea.addEventListener('input', () => {
    ytext.insert(textArea.value.length - 1, textArea.value.slice(-1))
  })
})
</script>

<template>
  <header>
    <CommonFileHeader :title="title"></CommonFileHeader>
  </header>
  <!--  引入文件编辑器-->
  <div id="editor">
    <div>
      <h1>标题</h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
#editor {
  height: calc(100vh - 100px);
  width: 50%;
  margin: auto;
}
</style>
