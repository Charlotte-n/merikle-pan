<script setup lang="ts">
import PreviewImage from '@/components/preview/PreviewImage.vue'
import { computed, getCurrentInstance, nextTick, ref } from 'vue'
import { imageUrlBase } from '@/data/common.ts'
import Window from '@/components/window/index.vue'
import PreviewVideo from '@/components/preview/PreviewVideo.vue'
import PreviewDoc from '@/components/preview/PreviewDoc.vue'
import PreviewExcel from '@/components/preview/PreviewExcel.vue'

//获取文件图片
const imageUrl = computed(() => {
  console.log(fileInfo.value, '文件信息为')
  console.log(imageUrlBase + fileInfo.value.fileCover)
  return imageUrlBase + fileInfo.value.fileCover
})

//显示PreviewImage
const PreviewImageRef = ref<any>()
const windowShow = ref(false)
const fileInfo = ref()
const url = ref('')
const showPreviewImage = (data: any) => {
  fileInfo.value = data
  //如果是图片的话，那么就调用PreviewImage里面的show来显示
  if (fileInfo.value.file_type === 3) {
    nextTick(() => {
      PreviewImageRef.value.openImageView()
    })
  } else {
    //进行赋值
    url.value = data.fileCover
    windowShow.value = true
  }
}
const closeWindow = () => {
  windowShow.value = false
}
defineExpose({ showPreviewImage })
</script>

<template>
  <PreviewImage
    ref="PreviewImageRef"
    :image-list="[imageUrl]"
    v-if="fileInfo && fileInfo.file_type === 3"
  ></PreviewImage>
  <Window
    :show="windowShow"
    v-else
    :width="fileInfo && fileInfo.file_type === 1 ? 1000 : 900"
    :title="fileInfo && fileInfo.name"
    align="top"
    @close="closeWindow"
  >
    <PreviewVideo :url="url" v-if="fileInfo && fileInfo.file_type === 1"></PreviewVideo>
    <PreviewDoc :url="url" v-if="fileInfo && fileInfo.file_type === 5"></PreviewDoc>
    <PreviewExcel :url="url" v-if="fileInfo && fileInfo.file_type === 6"></PreviewExcel>
  </Window>
</template>

<style scoped lang="scss"></style>
