<script setup lang="ts">
import Header from '@/views/lay-out/header.vue'
import { useRouter, useRoute } from 'vue-router'
import { nextTick, onMounted, provide, ref, watch } from 'vue'
import { menu } from '@/data/home.ts'
import { getUserSpaceApi } from '@/apis/user.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
const router = useRouter()
const route = useRoute()
const userStore = useUserInfo()

//跳转页面
const jump = (item: any) => {
  router.push(item.path)
}
const currentMenu = ref()
const currentPath = ref()
//设置导航栏的高亮
const setMenu = (menuCode: string, path: string) => {
  currentMenu.value = menu.find((item) => item.menuCode === menuCode)
  currentPath.value = path
}
watch(
  () => route,
  (newValue) => {
    if (newValue.meta.menuCode) {
      setMenu(newValue.meta.menuCode as string, newValue.path)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const header = ref()
let addFile = header.value?.addFile
// let getAllFile =
onMounted(() => {
  addFile = header.value.addFile
})

//查一下这个是为什么
const isShow = ref(false)
onMounted(() => {
  nextTick(() => {
    isShow.value = true
  })
})

//获取实例,上传的时候更新数据
const routerRef = ref()
const UploadCallBackHandler = () => {
  nextTick(() => {
    routerRef.value.getAllFile()
    // TODO:更新用户的空间
  })
}
//获取用户的使用空间
const userSpace = ref({} as { useSpace: string; totalSpace: string })
const getSpace = async () => {
  const res = await getUserSpaceApi((userStore.userInfo as any)._id)
  userSpace.value = res.data
}
onMounted(() => {
  getSpace()
})
provide('reload', UploadCallBackHandler)
</script>

<template>
  <!--  头部-->
  <Header ref="header"></Header>
  <div class="flex">
    <!--  左侧导航栏-->
    <!--    一级导航-->
    <div class="left-menu-first pt-[10px] shadow-xl flex-[0.8]">
      <div
        v-for="item in menu"
        :key="item.name"
        class="h-[80px] flex flex-col justify-center items-center text-[#636D7E] bg-white cursor-pointer hover:bg-[#F3F3F3]"
        @click="jump(item)"
      >
        <div
          :class="[
            'iconfont',
            'icon-' + item.icon,
            'text-[25px]',
            item.menuCode === currentMenu.menuCode ? 'active' : ''
          ]"
        ></div>

        <div :class="[item.menuCode === currentMenu.menuCode ? 'active' : '', 'text-[15pz]']">
          {{ item.name }}
        </div>
      </div>
    </div>
    <!--    二级导航-->
    <div class="flex-[2] left-menu-second mt-[20px] flex flex-col">
      <div class="flex-1 text-center">
        <div
          class="sub-menu h-[40px] flex justify-center m-auto cursor-pointer hover:bg-[#F3F3F3] w-[85%]"
          style="line-height: 40px"
          v-for="item in currentMenu.children"
          :key="item.name"
          @click="jump(item)"
          :class="item.path === currentPath ? 'second-active' : ''"
        >
          <div
            v-if="item.icon"
            :class="[
              'iconfont',
              'icon-' + item.icon,
              'icon mr-[20px] text-[14px]',
              item.path === currentPath ? 'active' : ''
            ]"
          ></div>
          <div class="text-[13px]" :class="item.path === currentPath ? 'active' : ''">
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="currentMenu.tips"
          class="text-[12px] pl-[10px] pr-[10px] mt-[10px] text-[#ABACAB]"
          style="line-height: 1.5"
        >
          {{ currentMenu?.tips }}
        </div>
      </div>

      <div class="pl-[10px] mb-[20px] text-[10px]">
        <div class="">空间的使用</div>
        <div>
          <a-progress
            :percent="
              ((Number(userSpace.useSpace) / Number(userSpace.totalSpace)) * 100).toFixed(0)
            "
            size="small"
          />
        </div>
        <div class="flex items-center">
          <span class="flex-1"
            >{{ Number(userSpace.useSpace).toFixed(2) }}GB/{{ userSpace.totalSpace }}GB</span
          >
          <span class="iconfont icon-refresh text-[#1677FF] cursor-pointer"></span>
        </div>
      </div>
    </div>
    <!--  右侧内容-->
    <div class="flex-[10]">
      <RouterView v-if="isShow">
        <template v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" @addFile="addFile" v-if="true" ref="routerRef"></component>
          </keep-alive>
        </template>
      </RouterView>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-menu-first {
  height: calc(100vh - 56px);
}
.left-menu-second {
  border-right: 1px solid #f3f3f3;
}
.active {
  color: #05a1f7 !important;
}
.second-active {
  background-color: #eef9fe;
}
.icon {
  color: #636d7e;
}
</style>
