<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'APlayer/dist/APlayer.min.css'
//@ts-ignore
import APlayer from 'Aplayer'
import { imageUrlBase } from '@/data/common.ts'

const props = defineProps({
  url: {
    type: String
  }
})
const playerRef = ref()
const player = ref()
const initMusic = () => {
  player.value = new APlayer({
    container: playerRef.value,
    audio: [
      {
        name: props.url,
        artist: '',
        url: imageUrlBase + props.url,
        cover: 'cover.jpg'
      }
    ]
  })
}
onMounted(() => {
  initMusic()
})
</script>

<template>
  <div class="music">
    <div class="body-content">
      <div class="cover">
        <!--        音乐的封面-->
        <img src="@/assets/icon-image/music.png" alt="music" />
      </div>
      <div class="playerRef" ref="playerRef"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.music {
  width: 100%;
  padding: 10px;
}
.playerRef {
  width: 100%;
  margin-top: 100px;
}
</style>
