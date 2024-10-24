<script setup lang="ts">
import { useUserInfo } from '@/stores/userInfo'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShareInfoApi } from '@/apis/share'
import type { ShareInfoData } from '@/apis/types/share'
import moment from 'moment'
import { message } from 'ant-design-vue'

const userStore = useUserInfo()
const route = useRoute()
const router = useRouter()
//获取分享的文件信息
const shareInfo = ref({} as ShareInfoData)
const getShareInfo = async () => {
  try {
    const res = await getShareInfoApi(route.params.shareId)
    console.log(res.data)
    if (res.code === 0) {
      shareInfo.value = res.data
    }
  } catch (e) {
    console.log(e, '获取分享文件接口错误')
  }
}
const code = ref('')
const gotoShareDetail = () => {
  if (code.value === shareInfo.value.code) {
    router.push('/share/' + route.params.shareId)
  } else {
    message.error('验证码错误')
  }
}
onMounted(() => {
  getShareInfo()
})
</script>

<template>
  <div class="flex flex-col items-center h-[100vh] bg-[#EEF2F5]">
    <!--    logo-->
    <div style="transform: translateY(150px)">
      <div class="h-[50px] w-[100%px] flex items-center justify-center">
        <img src="@/assets/favicon.ico" alt="logo" class="h-[100%] w-[50px] mr-[10px]" />
        <div class="text-[#05A1F7]" style="font-weight: 800; font-size: 23px">MeriklePan</div>
      </div>
      <div class="justify-center flex w-[100%]">
        <ACard>
          <!--        header-->
          <div
            class="w-[500px] bg-[#05A1F7] pt-[10px] pl-[10px] pb-[10px]"
            style="border-top-left-radius: 2px; border-top-right-radius: 2px"
          >
            <div class="flex items-center">
              <img
                :src="`http://localhost:3000/static/` + userStore.userInfo.avatar"
                alt="头像"
                class="w-[40px] h-[40px] mr-[10px]"
                style="border-radius: 100%"
              />
              <div class="text-white">
                <div class="text-[15px] flex items-center">
                  <div class="text-[20px] mr-[20px]">
                    {{ (userStore.userInfo as { nick_name }).nick_name }}
                  </div>
                  <div>分享于: {{ moment(Number(shareInfo.time)).format('YYYY-MM-DD') }}</div>
                </div>
                <div>分享文件: {{ shareInfo.fileName }}</div>
              </div>
            </div>
          </div>
          <!--        内容-->
          <div class="pl-[20px] pt-[20px] pb-[60px] pr-[20px]">
            <div class="mb-[10px]">请输入提取码:</div>
            <a-form>
              <a-form-item>
                <div class="flex">
                  <a-input v-model:value="code"></a-input>
                  <a-button class="ml-[10px]" type="primary" @click="gotoShareDetail"
                    >提取文件</a-button
                  >
                </div>
              </a-form-item>
            </a-form>
          </div>
        </ACard>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.ant-card-body) {
  padding: 0;
}
</style>
