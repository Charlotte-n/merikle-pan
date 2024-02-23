<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  time: number
  text: string
}>()
const emits = defineEmits(['getTime'])
const MyTime = ref(props.time)
const countDown = () => {
  const id = setInterval(() => {
    MyTime.value--
    if (MyTime.value <= 0) {
      emits('getTime')
      clearInterval(id)
    }
  }, 1000)
}
onMounted(() => {
  countDown()
})
</script>

<template>
  <a-button type="primary" disabled>{{ MyTime }}s后{{ text }}</a-button>
</template>

<style scoped lang="scss"></style>
