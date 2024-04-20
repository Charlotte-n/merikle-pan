<script setup lang="ts">
import CommonFileHeader from '@/views/ShareFile/c-pages/components/header/CommonFileHeader.vue'
import { WebsocketProvider } from 'y-websocket'
//@ts-ignore
import Quill from 'quill'
import { QuillBinding } from 'y-quill'
import * as Y from 'yjs'
import { onMounted, ref } from 'vue'

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
let first = ref(true)
//获取文档内容
onMounted(() => {
  const quill = new Quill('#editor', options)
  const ydoc = new Y.Doc() // y 文档对象，保存需要共享的数据
  const ytext = ydoc.getText('quill') // 创建名为 quill 的 Text 对象
  const provider = new WebsocketProvider('ws://localhost:1234', 'demo', ydoc)
  const binding = new QuillBinding(ytext, quill, provider.awareness) // 数据模型绑定
  const textArea = document.createElement('textarea')
  if (first.value) {
    //获取数据库里面该文档里面的内容，进行设置
    quill.setContents([
      { insert: 'Hello ' },
      { insert: 'World!', attributes: { bold: true } },
      { insert: '\n' }
    ])
  }
  first.value = false
  ytext.observe((event) => {
    textArea.value = ytext.toString()
    console.log(quill.getContents())
  })

  textArea.addEventListener('input', () => {
    console.log(ytext, '文档的变化')
    ytext.insert(textArea.value.length - 1, textArea.value.slice(-1))
  })
})
</script>

<template>
  <header>
    <CommonFileHeader></CommonFileHeader>
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
