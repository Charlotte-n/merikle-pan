<script setup lang="ts">
import { useModal } from '@/hooks/login-use-data.ts'
import type { ModalPropsType } from '@/components/ant-modal/type.ts'

const props = defineProps<ModalPropsType>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'ok'): void
  (e: 'showOtherBtn'): void
}>()
const { open, title, width, btn, btnOtherShow } = useModal(props)

const close = () => {
  emit('close')
}
const handleOk = () => {
  emit('ok')
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="title"
    :width="width"
    :footer="null"
    @cancel="close"
    class="model"
  >
    <div
      class="border-t-[1px] border-b-[1px] border-solid border-l-0 border-r-0 border-[#DDDDDD] pt-[10px] pb-[10px] pl-[15px] pr-[10px] max-h-[300px] overflow-auto"
    >
      <slot></slot>
    </div>
    <template v-if="btn?.text || showCancel">
      <div class="flex justify-end mt-[20px] pl-[15px] pr-[10px]">
        <a-button v-if="showCancel" :type="btn?.type || 'default'" class="mr-[10px]" @click="close"
          >取消</a-button
        >
        <a-button
          :type="btn?.type || 'primary'"
          @click="
            () => {
              handleOk()
            }
          "
          v-if="!btnOtherShow"
          >{{ btn?.text }}</a-button
        >
        <template v-else>
          <slot name="okBtn"></slot>
        </template>
      </div>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped></style>
