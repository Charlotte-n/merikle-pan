<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue'
import { h, ref } from 'vue'
import { useCommonStore } from '@/stores/common.ts'
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px'
  },
  spin: true
})
const CommonStore = useCommonStore()
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
#app {
  height: 100vh;
}
</style>
