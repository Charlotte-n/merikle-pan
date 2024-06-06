<script setup lang="ts">
import MyModel from '@/components/ant-modal/ant-modal.vue'
import { ref } from 'vue'
import Icon from '@/components/icon/index.vue'
import Navigation from '@/components/navigation/index.vue'
import { getSubCategoryApi, MoveFileOrDirectoryApi } from '@/apis/directory.ts'
import { message } from 'ant-design-vue'

const props = defineProps<{
  open: boolean
  currentId: string
  data: any
  ids: string[]
}>()
const emits = defineEmits(['close', 'moveFileOrDirectory', 'getAllFile', 'clearSelectedKey'])
const directory = ref<any>(props.data)
//选择目录
const navigateRef = ref()
const selectFolder = (data: { filename: string; fileId: string }) => {
  navigateRef.value.openFolder(data)
}
//获取目录
const fileId = ref('')
const currentFolder = ref()
const category = ref([] as string[])
const navChange = (data: { categoryId: string; currentFolder: string }) => {
  currentFolder.value = data.categoryId
  fileId.value = (data.currentFolder as any).fileId
  if (fileId.value) {
    //获取该目录下的目录
    getSubCategoryApi(fileId.value, props.ids ? props.ids : [props.currentId]).then((res) => {
      directory.value = res.data
    })
    //设置导航目录
    category.value.push(fileId.value)
  }
}

//移动文件
const moveFileOrDirectory = (folderId: string) => {
  if (props.currentId === folderId) {
    message.error('已经在当前目录了')
    return
  }
  //进行移动
  if (props.ids.length) {
    //批量移动
    MoveFileOrDirectoryApi({ ids: props.ids, filePid: folderId })
    emits('clearSelectedKey')
    emits('getAllFile')
  } else {
    MoveFileOrDirectoryApi({ ids: [props.currentId], filePid: folderId })
    emits('getAllFile')
  }
  //更新目录和关闭弹窗
  emits('close')
}
</script>

<template>
  <div>
    <MyModel
      :btn-other-show="false"
      :open="props.open"
      title="移动到"
      show-cancel
      :ok-btn="{
        text: '移动到此',
        type: 'primary'
      }"
      @close="
        () => {
          emits('close')
        }
      "
      @ok="
        () => {
          moveFileOrDirectory(fileId)
        }
      "
    >
      <!--      文件内容-->
      <div>
        <!--        <div>全部文件</div>-->
        <Navigation @navChange="navChange" :isWatchPath="false" ref="navigateRef"></Navigation>
        <div class="">
          <div
            v-for="item in directory"
            :key="item._id"
            :class="['', 'flex  hover:cursor-pointer']"
          >
            <div
              :class="`w-[100%] flex items-center h-[50px] item`"
              @click="selectFolder({ fileId: item._id, filename: item.file_name }, item)"
            >
              <Icon
                :file-type="
                  item.file_type
                    ? item.file_type
                    : item.folder_type
                      ? item.folder_type - 1
                      : item.folder_type
                "
              ></Icon>
              <!--              <Icon v-else :file-type="item.file_type"></Icon>-->
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
