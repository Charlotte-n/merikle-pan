<script lang="ts" setup>
import { onMounted, ref } from 'vue'

interface SplitSingle {
  id: number
  width: number
  type: String
}

interface MouseData {
  id: number
  width: number
  startX: number
  clientX: number
}

const props = defineProps({
  firstPanelWidth: {
    type: Number,
    default: 50
  }
})
const splitList = ref<SplitSingle[]>([
  {
    id: 1,
    width: 50,
    type: 'left'
  },
  {
    id: 2,
    width: 50,
    type: 'right'
  }
])
const container = ref({
  width: 0
})
const splitRef = ref<HTMLElement>()
const mouseData = ref<MouseData>({
  id: 0,
  width: 0,
  startX: 0,
  clientX: 0
})
const isDown = ref(false)

const initWidth = () => {
  container.value.width = splitRef.value?.clientWidth || 0
  splitList.value[0].width = props.firstPanelWidth
  splitList.value[1].width = container.value.width - splitList.value[0].width
}

onMounted(() => {
  initWidth()
})

const setMouseData = (options: { [key: string]: any }) => {
  mouseData.value = {
    ...mouseData.value,
    ...options
  }
}
const handleMouseDown = (e: MouseEvent, item: SplitSingle) => {
  isDown.value = true
  setMouseData({ id: item.id, width: item.width, startX: e.clientX })
}

const handleMouseMove = (e: MouseEvent) => {}

const handleMouseUp = (e: MouseEvent) => {
  isDown.value = false
}

//移动
</script>

<template>
  <div class="split-panel" ref="splitRef">
    <div v-for="(item, index) in splitList" :key="item.id" :width="item.width + 'px'">
      <slot :name="item.type"></slot>
      <div
        class="handle"
        @mousedown="(e) => handleMouseDown(e, item)"
        v-if="index !== splitList.length - 1"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.split-panel {
  .handle {
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    border-right: 1px solid #ccc;
    cursor: e-resize;
    user-select: none;
  }
}
</style>
