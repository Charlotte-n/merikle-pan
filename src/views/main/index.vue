<script setup lang="ts">
import {
  UploadOutlined,
  FolderOpenOutlined,
  CloseSquareFilled,
  CheckSquareFilled
} from '@ant-design/icons-vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Hover from '@/components/hover/index.vue'
import { HomeColumns, HomeHoverData } from '@/data/home.ts'
import { addFolderApi, getAllFileApi, RenameFileApi } from '@/apis/file.ts'
import moment from 'moment'
import Icon from '@/components/icon/index.vue'
import type { AddFolderDataType, RenameFileDataType } from '@/apis/types/file.ts'
import { message } from 'ant-design-vue'
import { useUserInfo } from '@/stores/userInfo.ts'
import { getImage } from '@/util/getImage.ts'

const route = useRoute()
const currentSecondMenuCategory = ref()
const emits = defineEmits(['addFile'])
const HomeData = ref<any>([])
const UserStore = useUserInfo()
watch(
  () => route,
  (newValue) => {
    currentSecondMenuCategory.value = newValue.params.category
  },
  {
    immediate: true,
    deep: true
  }
)

//上传
const uploadHandler = async (file: any) => {
  console.log(123)
  await new Promise((resolve) => setTimeout(resolve, 0))
  emits('addFile', { file: file, filePid: file.uid })
  return false
}
const editRef = ref()
const addStatus = ref(false)
//新建文件夹
const newItem = ref({
  key: 3,
  name: '',
  time: '',
  size: '',
  //目录
  file_type: 0,
  showEdit: true,
  fileId: '',
  filePid: 0,
  folder_type: 1
})
const add = async () => {
  DelOrEditName.value = DelOrEditNameEnum.DEL
  confirmStatus.value = CONFIRM_STATUS.ADD_FOLDER
  if (addStatus.value) {
    return
  }
  HomeData.value.unshift(newItem.value)
  nextTick(() => {
    editRef.value.focus()
  })
  addStatus.value = true
}
/**
 * 新建文件夹和重命名
 */

enum CONFIRM_STATUS {
  ADD_FOLDER = 0,
  RENAME_FILE = 1
}

const confirmStatus = ref(1)
const fileName = ref('')
const addFolder = async (index: number) => {
  //判断是重命名还是添加文件夹
  if (confirmStatus.value === CONFIRM_STATUS.ADD_FOLDER) {
    if (newItem.value.name.indexOf('/') !== -1) {
      message.error('不能含有/等特殊字符')
      return
    }
    const param: AddFolderDataType = {
      fileId: '',
      filePid: 0,
      name: newItem.value.name,
      user_id: UserStore.userInfo._id
    }
    const res = await addFolderApi(param)
    if (res.code === 0) {
      message.success('创建成功')
      //显示这个文件
      HomeData.value[0].showEdit = false
      addStatus.value = false
      newItem.value = {
        key: 3,
        name: '',
        time: '',
        size: '',
        file_type: 0,
        showEdit: true,
        fileId: '',
        filePid: 0,
        folder_type: 1
      }
    } else {
      message.error(res.message)
    }
  } else if (confirmStatus.value === CONFIRM_STATUS.RENAME_FILE) {
    await RenameFile(index)
  }
}
//重命名
const RenameFile = async (index: number) => {
  const param = ref<RenameFileDataType>({
    filename: newItem.value.name,
    _id: HomeData.value[index]._id
  })
  const res = await RenameFileApi(param.value)
  if (res.code === 0) {
    message.success('重命名成功')
    //然后显示重命名的内容
    HomeData.value[index].showEdit = false
  } else {
    message.error(res.message)
  }
}

//定义是删除新建的文件夹还是重命名
enum DelOrEditNameEnum {
  DEL = 0,
  EDIT_NAME = 1
}
const DelOrEditName = ref(1)
//删除文件名
const cancelFolder = (index: number) => {
  //如果是重命名的话就
  if (DelOrEditName.value === DelOrEditNameEnum.EDIT_NAME) {
    HomeData.value[index].showEdit = false
  } else {
    HomeData.value.shift()
    addStatus.value = false
  }
}
const share = () => {
  console.log('分享')
}
const del = () => {
  console.log('删除')
}
const edit = (index: number) => {
  DelOrEditName.value = DelOrEditNameEnum.EDIT_NAME
  confirmStatus.value = CONFIRM_STATUS.RENAME_FILE
  //如果出现了新建文件夹，将他置为showEdit=false
  if (HomeData.value[0].showEdit) {
    //删除这个数据
    HomeData.value.shift()
    HomeData.value[0].showEdit = false
    index = index - 1
  }
  HomeData.value?.forEach((item: any) => {
    item.showEdit = false
  })
  HomeData.value[index].showEdit = true
}
const move = () => {
  console.log('移动')
}
//获取所有文件
const pageSize = ref(20)
const page = ref(1)
const getAllFile = async () => {
  const param = {
    page: page.value,
    pageSize: pageSize.value
  }
  const res = await getAllFileApi(param)
  HomeData.value = res.data.map((item: any, index: number) => {
    return {
      key: index,
      name: item.file_name ? item.file_name : '',
      time: item.create_time ? moment(Number(item.create_time)).format('YYYY-MM-DD hh:mm:ss') : '',
      size: item.file_size ? item.file_size : '',
      showEdit: false,
      file_type: item.file_type,
      folder_type: item.folder_type ? item.folder_type : 0,
      _id: item._id,
      fileCover: item.file_cover ? item.file_cover : ''
    }
  })
  console.log(HomeData.value)
}
//得到分页数
const pagation = ref(1)
const getPagation = (index) => {
  // pagation.value
}

onMounted(() => {
  getAllFile()
})
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <!--    头部-->
    <div class="flex items-center space-x-2 w-[100%]">
      <a-upload :showUploadList="false" :beforeUpload="uploadHandler">
        <a-button type="primary">
          <template #icon>
            <upload-outlined />
          </template>
          上传
        </a-button>
      </a-upload>
      <a-button
        class="bg-[#67C23A] text-white border-[white] hover:opacity-60 h-[35px]"
        v-if="currentSecondMenuCategory === 'all'"
        @click="add"
      >
        <template #icon>
          <FolderOpenOutlined />
        </template>
        新建文件夹
      </a-button>
      <a-button type="primary" danger :disabled="HomeData.length === 0">
        <template #icon>
          <span class="iconfont icon-del mr-[10px] text-[15px]"></span>
        </template>
        批量删除
      </a-button>
      <a-button
        class="bg-amber-500 text-white border-[white] hover:opacity-60 h-[35px]"
        :disabled="HomeData.length === 0"
      >
        <template #icon>
          <span class="iconfont icon-move text-[15px] mr-[10px]"></span>
        </template>
        批量移动
      </a-button>
      <a-input-search class="xl:w-[25%]" placeholder="输入文件名搜索" allowClear></a-input-search>
      <i class="iconfont icon-refresh cursor-pointer" @click="getAllFile"></i>
    </div>
    <!--    全部文件-->
    <div class="mt-[10px] mb-[15px] text-[#636D7E] text-[13px]" style="font-weight: 800">
      全部文件
    </div>
    <!--    文件展示-->
    <MyTable
      :columns="HomeColumns"
      :data="HomeData"
      class=""
      :pagination="true"
      :page-size="15"
      :ext-height="80"
      :add="true"
      @change="getPagation"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <div class="flex justify-between">
            <div v-if="!record.showEdit" class="items-center flex">
              <!--              判断是否为图片或者音频-->
              <template v-if="record.file_type === 1 || record.file_type === 3">
                <div>{{ index }}</div>
                <Icon :cover="HomeData[index].fileCover"></Icon>
              </template>
              <template v-else>
                <!--              判断是否为folder-->
                <Icon v-if="record.folder_type === 0" :file-type="record.file_type"> </Icon>
                <Icon v-if="record.folder_type === 1" :file-type="0"></Icon>
              </template>
              <div class="ml-[10px]">
                {{ record.name }}
              </div>
            </div>
            <div v-if="record.showEdit" class="flex justify-center items-center">
              <a-input
                class="mr-[20px] w-[400px]"
                ref="editRef"
                v-model:value="newItem.name"
              ></a-input>
              <CloseSquareFilled
                class="mr-[10px] text-[25px] text-[#05A1F7] cursor-pointer close"
                @click="cancelFolder(index)"
              />
              <CheckSquareFilled
                class="text-[25px] text-[#05A1F7] cursor-pointer confirm"
                @click="addFolder(index)"
              />
            </div>
            <div style="display: none" class="hover-v1" v-if="!record.showEdit">
              <Hover
                :data="HomeHoverData"
                @share1="share"
                @del="del"
                @edit="edit(index)"
                @move="move"
              ></Hover>
            </div>
          </div>
        </template>
      </template>
    </MyTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.my-row) {
  &:hover {
    .hover-v1 {
      display: block !important;
    }
  }
}
.confirm,
.close {
  &:hover {
    opacity: 0.8;
  }
}

:global(.table-1 .ant-table-cell) {
  color: #909399 !important;
}
</style>
