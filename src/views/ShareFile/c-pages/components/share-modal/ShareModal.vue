<script setup lang="ts">
import { CommonFileShareData } from '@/data/common-file.ts'
import useClipboard from 'vue-clipboard3'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { UrlBaseOther } from '@/data/common.ts'
import { jsPDF } from 'jspdf'
import { nextTick, onMounted, ref } from 'vue'
import { updateFilePrivial } from '@/apis/commonFile.ts'

const props = defineProps<{
  open: boolean
  title: string
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'exportPdf'): void
}>()
const route = useRoute()
const { toClipboard } = useClipboard()

//#region 复制链接
const copyLink = async () => {
  await toClipboard(`链接为:${UrlBaseOther + route.fullPath}`)
  closeModal()
  message.success('复制成功')
}
//endregion

//#region 导出为pdf
const doc = new jsPDF()
const exportPdf = async () => {
  closeModal()
  emit('exportPdf')
  message.success('导出成功')
}
//#endregion
//#region 切换active
const currentActive = ref(0)
const changeActive = (e: any) => {
  //移除其他的
  const res = document.querySelectorAll('.list')
  for (let i = 0; i < res.length; i++) {
    res[i].classList.remove('active')
  }
  currentActive.value = e.target.innerText === '可编辑' ? 1 : 0

  e.target.classList.add('active')
}
const changePrivial = async () => {
  //修改该文件的状态
  await updateFilePrivial({ id: route.params.id as string, edit: currentActive.value })
}

//#endregion

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <a-modal :open="open" :footer="false" :width="350" @close="closeModal" @cancel="closeModal">
    <header class="pl-[15px] text-[18px]">分享</header>
    <div class="mt-[10px] pl-[15px] text-[10px] pr-[15px] pb-[10px]">
      <div>谁可以查看/编辑文件</div>
      <div>
        <div
          v-for="item in CommonFileShareData"
          :key="item.key"
          @click="changeActive"
          :class="[
            'text-[13px] pt-[10px] pl-[15px] cursor-pointer list',
            item.default ? item.default : ''
          ]"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <section class="flex-row pr-[20px] text-end">
      <a-button type="primary" @click="changePrivial">确定</a-button>
    </section>
    <div class="pl-[15px] text-[#5C5C5C]">
      <div>分享至</div>
      <!--      内容-->
      <div class="mt-[10px] flex">
        <!--        复制链接-->
        <div class="mr-[40px] cursor-pointer" @click="copyLink">
          <div class="bg-[#F3F5F7] pl-[10px] pr-[10px] pt-[10px] pb-[10px]">
            <img src="@/assets/icon-image/link.png" class="w-[30px]" alt="" />
          </div>
          <div class="mt-[10px] text-[13px]">复制链接</div>
        </div>
        <!--        转化为PDF-->
        <div class="cursor-pointer" @click="exportPdf">
          <div class="bg-[#F3F5F7] pl-[10px] pr-[10px] pt-[10px] pb-[10px]">
            <img src="@/assets/icon-image/pdf.png" class="w-[30px]" alt="" />
          </div>
          <div class="pt-[10px] text-[13px]">转化为pdf</div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
:deep(.ant-modal-content) {
  padding-right: 10px;
}
:deep(.ant-modal-footer) {
  padding-right: 10px;
}
.active::before {
  display: inline-block;
  content: '√';
  width: 15px;
  height: 1px;
  color: #05a1f7;
}
</style>
