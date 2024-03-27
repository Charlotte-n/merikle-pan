<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean
  },
  width: {
    type: Number
  },
  title: {
    type: String
  },
  align: {
    type: String
  }
})
const windowWith = ref(window.innerWidth)
const windowContentWidth = computed(() => {
  return props.width! > windowWith.value ? windowWith.value : props.width
})
const windowContentLeft = computed(() => {
  let left = windowWith.value - props.width!
  return left < 0 ? 0 : left / 2
})

const emits = defineEmits(['close'])
const closeShow = () => {
  emits('close')
}
//监听屏幕变化
const resizeWindow = () => {
  windowWith.value = window.innerWidth
}
onMounted(() => {
  console.log('文件名字为')
  window.addEventListener('resize', resizeWindow)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeWindow)
})
</script>

<template>
  <div v-if="props.show" class="window">
    <div class="mask" v-if="props.show"></div>
    <!--    关闭-->
    <div class="close" @click="closeShow">
      <span class="iconfont icon-close2 close1"></span>
    </div>
    <!--    window内容-->
    <div
      class="window_content"
      :style="{ width: windowContentWidth + 'px', top: 0, left: windowContentLeft + 'px' }"
    >
      <div class="title">{{ props.title }}</div>
      <div class="content_body m-auto text-center flex justify-center mt-[10px]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.window {
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #000;
    opacity: 0.3;
    width: 100%;
    height: calc(100vh);
    z-index: 200;
  }
  .close {
    z-index: 202;
    position: absolute;
    top: 30px;
    right: 30px;
    border: 1px solid #cccccc;
    border-radius: 100%;
    padding: 5px;
    background-color: #ccc;
    cursor: pointer;
    .close1 {
      cursor: pointer;
    }
  }
  .window_content {
    position: absolute;
    top: 0;
    background: white;
    z-index: 202;
    .title {
      text-align: center;
    }
    .content_body {
      display: flex;
      overflow: auto;
      height: calc(100vh - 30px);
    }
  }
}
</style>
