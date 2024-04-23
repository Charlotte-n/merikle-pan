<script setup lang="ts">
import { useUserInfo } from '@/stores/userInfo.ts'
import { onMounted, ref } from 'vue'
import { getImage } from '@/util/getImage.ts'

const UserStore = useUserInfo()
const avatar = ref('')
const props = defineProps<{
  title: string
}>()
onMounted(() => {
  avatar.value = getImage(UserStore.userInfo.avatar)
})
</script>

<template>
  <div class="pl-[10px] pt-[10px] pr-[10px]">
    <div class="flex justify-between">
      <div class="flex items-center">
        <img
          src="../../../../../assets/icon-image/home.png"
          alt=""
          class="h-[20px] w-[20px] cursor-pointer"
        />
        <div class="w-[1px] h-[10px] bg-[#cccccc] ml-[10px] mr-[10px]"></div>
        <div class="text-[15px]">{{ title }}</div>
        <div class="mr-[20px]"></div>
        <div class="text-[10px] text-[#cccccc]">所有的编辑内容都会自动保存到云端</div>
      </div>
      <div class="flex items-center">
        <a-button type="primary">分享</a-button>
        <div class="w-[1px] h-[10px] bg-[#cccccc] ml-[10px] mr-[10px]"></div>
        <div>
          <img :src="avatar" alt="用户头像" class="w-[50px] h-[50px]" style="border-radius: 10px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  border-right: 1px solid #cccccc;
}
</style>
