<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  width: {
    type: Number
  },
  imageList: {
    type: Array
  }
})

//关闭
const visible = ref(false)
const openImageView = () => {
  visible.value = true
}

defineExpose({ openImageView })
</script>

<template>
  <div style="display: none">
    <a-image-preview-group :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }">
      <a-image :src="item" v-for="item in props.imageList" :key="item"></a-image>
    </a-image-preview-group>
  </div>
</template>

<style scoped lang="scss"></style>
