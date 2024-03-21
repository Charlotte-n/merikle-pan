<script setup lang="ts">
import MyModel from '@/components/ant-modal/ant-modal.vue'
import { onMounted } from 'vue'
import Icon from '@/components/icon/index.vue'
import type { GetAllDirectoryData } from '@/apis/types/directory.ts'

const props = defineProps<{
  open: boolean
  data: GetAllDirectoryData
}>()
const emits = defineEmits(['close', 'moveFileOrDirectory'])
//移动文件

//选择目录
const selectFolder = () => {
  console.log(123)
}
onMounted(() => {
  console.log(props.data)
})
//获取所有目录
</script>

<template>
  <div>
    <MyModel
      :btn-other-show="false"
      :open="props.open"
      title="移动到"
      show-cancel
      :ok-btn="{
        text: '移动到此'
      }"
      @close="
        () => {
          emits('close')
        }
      "
      @ok="
        () => {
          emits('moveFileOrDirectory')
        }
      "
    >
      <!--      文件内容-->
      <div>
        <div>全部文件</div>
        <div class="">
          <div v-for="item in data" :key="item._id" :class="['', 'flex  hover:cursor-pointer']">
            <div :class="`w-[100%] flex items-center h-[50px] item`" @click="selectFolder">
              <Icon :file-type="0"></Icon>
              <div class="ml-[10px]">{{ item.file_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </MyModel>
  </div>
</template>

<style scoped lang="scss">
.active {
  background-color: #cccccc;
}
.item {
  &:hover {
    background-color: #cccccc;
  }
}
</style>
