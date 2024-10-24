<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { createVNode, onMounted } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/stores/userInfo'
import { useI18n } from 'vue-i18n'
const emits = defineEmits(['cancel'])
const UserStore = useUserInfo()
const { t } = useI18n()
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
    title: t('common.tip'),
    icon: createVNode(ExclamationCircleOutlined),
    content: t('common.tips'),
    okText: t('common.confirm'),
    okType: 'danger',
    cancelText: t('common.cancel'),
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
