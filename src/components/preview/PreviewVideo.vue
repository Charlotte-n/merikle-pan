<script setup lang="ts">
import { onMounted, ref } from 'vue'
//@ts-ignore
import DPlayer from 'dplayer'
import { imageUrlBase } from '@/data/common.ts'

const props = defineProps({
  url: {
    type: String
  }
})

const player = ref<any>()
//初始化视频
const initVideo = () => {
  new DPlayer({
    container: player.value,
    screenshot: true,
    theme: '#b7daff',
    video: {
      url: imageUrlBase + props.url
    }
  })
}

onMounted(() => {
  initVideo()
})
</script>

<template>
  <div ref="player"></div>
</template>

<style scoped lang="scss"></style>
