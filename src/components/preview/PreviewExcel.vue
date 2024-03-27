<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFileStreamApi } from '@/apis/preview.ts'
import { read, utils } from 'xlsx'

const props = defineProps({
  url: {
    type: String
  }
})

const excelRef = ref()
const initExcel = async () => {
  const res = await getFileStreamApi(props.url as string, 'arraybuffer')
  const wb = read(new Uint8Array(res), { type: 'array' })
  /* update data */
  excelRef.value = utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]])
  console.log(excelRef.value)
}
onMounted(() => {
  initExcel()
})
</script>

<template>
  <div class="table-info" v-html="excelRef"></div>
</template>

<style scoped lang="scss">
.table-info {
  width: 100%;
  :deep table {
    width: 100%;
    border-collapse: collapse;
    td {
      border: 1px solid #dddddd;
      border-collapse: collapse;
      padding: 5px;
      height: 30px;
      min-width: 50px;
    }
  }
}
</style>
