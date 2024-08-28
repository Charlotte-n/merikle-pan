<script setup lang="ts">
import Avatar from '@/components/avatar/index.vue'
import { UserOutlined, DownOutlined } from '@ant-design/icons-vue'
import AvatarUpload from '@/views/lay-out/components/avatar-upload.vue'
import { computed, ref, defineExpose, inject } from 'vue'
import ChangePassword from '@/views/lay-out/components/change-password.vue'
import LoginOut from '@/views/lay-out/components/login-out.vue'
import { useUserInfo } from '@/stores/userInfo.ts'
import UploadTask from '@/views/lay-out/components/uploadTask.vue'
import { useCommonStore } from '@/stores/common.ts'
import { LOCALE_OPTIONS } from '@/lang'
import { useLang } from '@/hooks/lang.ts'
import { useI18n } from 'vue-i18n'

const CommonStore = useCommonStore()
const open = ref(false)
const cancel = () => {
  open.value = false
}
const changeOpen = () => {
  open.value = true
}
enum changeUserInfo {
  avatar = 0,
  password = 1,
  logOut = 2
}
const avatar = computed(() => {
  return 'http://localhost:3000/static/' + useUserInfo().userInfo.avatar
})

const currentStatus = ref()
// 根据不同的选择来显示Modal
const changePannal = (status: number) => {
  changeOpen()
  currentStatus.value = status
}
//上传组件
let uploadComponent = ref()
const popOverBtn = ref<HTMLSpanElement>(null)
const addFile = async (value: { file: File; filePid: string }) => {
  const { file, filePid } = value
  //当这个弹窗显示的话就会获取到这个uploadComponent
  CommonStore.uploadChangePopoverShow()
  // 等待弹窗组件渲染完成(很重要)
  await new Promise((resolve) => setTimeout(resolve, 100))
  if (uploadComponent.value?.addFile) {
    await uploadComponent.value.addFile(file, filePid)
  }
}

//国际化
const locales = [...LOCALE_OPTIONS]
const { locale } = useI18n()
const { changeLang, currentLang } = useLang(locale)

defineExpose({ addFile })
</script>

<template>
  <div
    class="w-[100%] h-[56px] bg-white shadow flex justify-between items-center pl-[20px] pr-[20px]"
  >
    <!--    左边logo-->
    <div class="text-[0px] flex-1 flex items-center">
      <img src="../../../public/favicon.ico" alt="" class="w-[30px] mr-[10px]" />
      <span class="text-[20px] text-[#05A1F5]">Merikle云盘</span>
    </div>
    <!--    右侧-->
    <div class="flex items-center">
      <!--      国际化-->
      <a-dropdown class="mr-[10px]">
        <template #overlay>
          <a-menu :selectedKeys="[currentLang]">
            <a-menu-item v-for="(item, index) in locales" :key="index" @click="changeLang(index)">{{
              item.label
            }}</a-menu-item>
          </a-menu>
        </template>
        <a-button shape="circle" class="flex items-center">
          <img src="@/assets/icon-image/wenzi.png" alt="" class="w-[30px] h-[30px]" />
        </a-button>
      </a-dropdown>
      <!--      弹窗-->
      <a-popover
        @click="CommonStore.changePopoverShow"
        :open="CommonStore.popoverShow"
        trigger="click"
      >
        <template #content>
          <UploadTask
            ref="uploadComponent"
            @closePopoverShow="CommonStore.closePopoverShow"
            :instance="popOverBtn"
          ></UploadTask>
        </template>
        <span
          class="iconfont icon-transfer text-[#666666] text-[20px] cursor-pointer"
          ref="popOverBtn"
        ></span>
      </a-popover>
      <!--      用户的下拉框-->
      <a-dropdown placement="bottom">
        <div v-if="!useUserInfo().userInfo.avatar">
          <Avatar :size="40" class="ml-[20px] cursor-pointer">
            <template #icon><UserOutlined /></template>
          </Avatar>
        </div>
        <div
          class="ml-[20px] w-[50px] h-[50px]"
          style="{
          border-radius: 100%;
        }"
          v-else
        >
          <img :src="avatar" class="w-[40px] h-[40px]" alt="" style="border-radius: 100%" />
        </div>
        <template #overlay>
          <a-menu ref="menu">
            <a-menu-item key="0">
              <a
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent
                @click="changePannal(changeUserInfo.avatar)"
              >
                {{ $t('user.avatar') }}
              </a>
            </a-menu-item>
            <a-menu-item key="1">
              <a
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent
                @click="changePannal(changeUserInfo.password)"
              >
                {{ $t('user.password') }}
              </a>
            </a-menu-item>
            <a-menu-item key="2" @click="changePannal(changeUserInfo.logOut)">
              {{ $t('user.login.out') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <span class="ml-[10px] text-[#05A1F5]">Merikle</span>
    </div>
  </div>
  <AvatarUpload
    v-if="currentStatus === changeUserInfo.avatar && open"
    :open="open"
    @cancel="cancel"
  ></AvatarUpload>
  <!--  修改密码-->
  <ChangePassword
    v-if="currentStatus === changeUserInfo.password && open"
    :open="open"
    @cancel="cancel"
  ></ChangePassword>
  <LoginOut
    v-if="currentStatus === changeUserInfo.logOut && open"
    :open="open"
    @cancel="cancel"
  ></LoginOut>
</template>

<style scoped lang="scss">
.popover-header {
  border-bottom: 1px solid #dddddd;
}
</style>
