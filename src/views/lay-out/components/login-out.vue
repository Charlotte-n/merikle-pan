<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { createVNode, onMounted } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
const emits = defineEmits(['cancel'])
const cancel = () => {
  emits('cancel')
}
onMounted(() => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要退出吗',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      cancel()
      console.log('OK')
    },
    onCancel() {
      cancel()
      console.log('Cancel')
    },
    bodyStyle: {
      padding: '0px 20px'
    },
    wrapClassName: 'modal'
  })
})
</script>

<template></template>

<style lang="scss" scoped>
:global(.modal .ant-modal-content) {
  border-radius: 8px !important;
}
</style>
