<script setup lang="ts">
import Avatar from '@/components/avatar/index.vue'
import { UserOutlined } from '@ant-design/icons-vue'
import AvatarUpload from '@/views/lay-out/components/avatar-upload.vue'
import { ref } from 'vue'
import ChangePassword from '@/views/lay-out/components/change-password.vue'
import LoginOut from '@/views/lay-out/components/login-out.vue'
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
const currentStatus = ref()
// 根据不同的选择来显示Modal
const changePannal = (status: number) => {
  changeOpen()
  currentStatus.value = status
}
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
      <!--      弹窗-->
      <a-popover trigger="click" class="content">
        <template #content>
          <header class="popover-header pl-[10px] pr-[10px] pt-[10px] pb-[10px]">
            <span>上传任务</span>
            <span class="text-[#AFAFAF] ml-[5px]">(仅展示本次上传任务)</span>
          </header>
          <main class="min-h-[450px] w-[800px]">
            <div class="text-center pt-[20px]">
              <span class="text-center text-[#666666]">暂无上传任务</span>
            </div>
          </main>
        </template>
        <span class="iconfont icon-transfer text-[#666666] text-[20px] cursor-pointer"></span>
      </a-popover>
      <!--      用户的下拉框-->
      <a-dropdown placement="bottom">
        <Avatar :size="40" class="ml-[20px] cursor-pointer">
          <template #icon><UserOutlined /></template>
        </Avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
              <a
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent
                @click="changePannal(changeUserInfo.avatar)"
              >
                修改头像
              </a>
            </a-menu-item>
            <a-menu-item key="1">
              <a
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent
                @click="changePannal(changeUserInfo.password)"
              >
                修改密码
              </a>
            </a-menu-item>
            <a-menu-item key="3" @click.prevent @click="changePannal(changeUserInfo.logOut)"
              >退出</a-menu-item
            >
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
