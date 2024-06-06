<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNavigationApi } from '@/apis/directory.ts'
import { useFileStore } from '@/stores/file.ts'

//是否要监听路由:因为不是所有的都要进行监听路由
const router = useRouter()
const route = useRoute()

const props = defineProps({
  isWatchPath: {
    type: Boolean,
    default: true
  }
})

//打开目录
const FolderList = ref<{ fileId: number | string }[]>([] as { fileId: number | string }[])
const currentFolder = ref({ fileId: 0 } as { fileId: string | number })
const openFolder = (data: { filename: string; fileId: number | string }) => {
  const { fileId } = data
  const folder = {
    fileId
  }
  FolderList.value.push(folder)
  currentFolder.value = folder
  //与路由相关联
  setPath()
}
const setPath = () => {
  if (!props.isWatchPath) {
    //不监听路由
    doCallBack()
    return
  }
  //监听路由,将文件的id放入里面
  let pathArray: string[] = [] as string[]
  FolderList.value.forEach((item) => {
    pathArray.push(item.fileId as string)
  })
  //然后将文件进行拼接
  router.push({
    path: route.fullPath,
    query: pathArray.length === 0 ? undefined : { path: pathArray.join('/') }
  })
}
//设置的当前目录
const setCurrentFolder = (index: number) => {
  if (index === -1) {
    currentFolder.value = { fileId: 0 }
    FolderList.value = []
  } else {
    currentFolder.value = FolderList.value[index] as any
    FolderList.value.splice(index + 1, FolderList.value.length)
  }
  setPath()
}
//返回上一级
const backParent = () => {
  let currentIndex = null
  for (let i = 0; i < FolderList.value.length; i++) {
    if (currentFolder.value.fileId === FolderList.value[i].fileId) {
      currentIndex = i
      break
    }
  }
  setCurrentFolder(((currentIndex as number) - 1) as number)
}
//获取目录导航
const resultNavigation = ref()
const getNavigation = async (path: string) => {
  const res = await getNavigationApi(path)
  resultNavigation.value = res.data.path.split('/')
}

const emits = defineEmits(['navChange'])
const doCallBack = () => {
  emits('navChange', {
    categoryId: (route.params as { category: string }).category,
    currentFolder: currentFolder.value
  })
  FolderList.value &&
    FolderList.value.length > 0 &&
    getNavigation(FolderList.value.map((item) => item.fileId).join('/'))
  //改变FilePid
  useFileStore().changeFilePid(currentFolder.value.fileId as string)
}

const init = () => {
  FolderList.value = []
  currentFolder.value = { fileId: 0 }
  doCallBack()
}
watch(
  () => route,
  (newValue) => {
    if (!props.isWatchPath) {
      return
    }
    //如果是其他的分类的话也不监听路由
    if (newValue.fullPath.indexOf('all') === -1) {
      return
    }
    const path = route.query.path
    if (path == undefined) {
      init()
    } else {
      getNavigation(path as string)
      let pathArray = (path as string).split('/')
      currentFolder.value = {
        fileId: pathArray[pathArray.length - 1]
      }
      doCallBack()
    }
  },
  { immediate: true, deep: true }
)

defineExpose({
  openFolder,
  getNavigation
})
</script>

<template>
  <div class="flex text-[10px] text-[#05A1F7]">
    <div class="mr-[5px] cursor-pointer" v-if="FolderList.length > 0" @click="backParent">
      {{ $t('navigator.prev') }} >
    </div>
    <div class="mr-[5px] cursor-pointer" v-else @click="setCurrentFolder(-1)">
      {{ $t('navigator.all') }} &gt;
    </div>
    <!--    显示其他的文件夹-->
    <div v-for="(item, index) in resultNavigation" :key="index">
      <span
        v-if="index !== resultNavigation.length - 1 && FolderList.length > 0"
        class="mr-[10px] cursor-pointer"
        @click="setCurrentFolder(index)"
        >{{ item }} ></span
      >
      <span
        v-if="index === resultNavigation.length - 1 && FolderList.length > 0"
        class="text-black"
        >{{ item }}</span
      >
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
