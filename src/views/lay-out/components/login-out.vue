<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { createVNode, onMounted } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/stores/userInfo.ts'
const emits = defineEmits(['cancel'])
const UserStore = useUserInfo()
const cancel = () => {
  emits('cancel')
}
const router = useRouter()
const ok = () => {
  //跳转到登录页面
  router.push('/login')
  //去除token
  // UserStore.token
  UserStore.logOut()
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
      ok()
    },
    onCancel() {
      cancel()
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
