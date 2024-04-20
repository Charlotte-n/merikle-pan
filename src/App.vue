<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue'
import { h, ref } from 'vue'
import { useCommonStore } from '@/stores/common.ts'
import 'quill/dist/quill.snow.css'
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px'
  },
  spin: true
})
const CommonStore = useCommonStore()
</script>

<template>
  <a-spin tip="Loading..." :spinning="CommonStore.spinning">
    <RouterView></RouterView>
  </a-spin>
</template>

<style scoped>
#app {
  height: 100vh;
}
</style>
