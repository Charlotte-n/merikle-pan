<script setup lang="ts">
import { onMounted, ref } from 'vue'
//@ts-ignore
import { renderAsync } from 'docx-preview'
import { getFileStreamApi } from '@/apis/preview.ts'
const props = defineProps({
  url: {
    type: String
  }
})

const docxRef = ref()
const initDoc = async () => {
  const res = await getFileStreamApi(props.url as string, 'blob')
  console.log(res)
  if (!res) {
    return
  }
  renderAsync(res, docxRef.value)
}
onMounted(() => {
  initDoc()
})
</script>

<template>
  <div ref="docxRef" class="docx"></div>
</template>

<style scoped lang="scss">
:deep .docx-wrapper {
  background-color: white;
}
</style>
