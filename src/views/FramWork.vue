<script setup lang="ts">
import Header from '@/views/lay-out/header.vue'
import { useRouter, useRoute } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'
import { menu } from '@/data/home.ts'
const router = useRouter()
const route = useRoute()

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
const dynamicComponent = ref()
let addFile = header.value?.addFile
onMounted(() => {
  addFile = header.value.addFile
  console.log(123, addFile)
  // 在组件创建时绑定事件
  console.log(dynamicComponent.value)
  if (dynamicComponent.value && dynamicComponent.value.$on) {
    dynamicComponent.value.$on('addFile', addFile)
  }
})
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
    <div class="flex-[2] left-menu-second text-center mt-[20px]">
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
    <!--  右侧内容-->
    <div class="flex-[10]">
      <RouterView>
        <template v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" @addFile="addFile" ref="dynamicComponent"></component>
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
