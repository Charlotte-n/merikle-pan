<script setup lang="ts">
import {
  UploadOutlined,
  FolderOpenOutlined,
  CloseSquareFilled,
  CheckSquareFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { computed, createVNode, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Hover from '@/components/hover/index.vue'
import { type DataItem, HomeColumns, HomeHoverData } from '@/data/home.ts'
import {
  addFolderApi,
  deleteFileApi,
  getAllFileApi,
  multipleDeleteApi,
  RenameFileApi
} from '@/apis/file.ts'
import moment from 'moment'
import Icon from '@/components/icon/index.vue'
import type {
  AddFolderDataType,
  DeleteFileDataType,
  RenameFileDataType
} from '@/apis/types/file.ts'
import { message, Modal } from 'ant-design-vue'
import { useUserInfo } from '@/stores/userInfo.ts'
import type { Key } from 'ant-design-vue/es/_util/type'
import Move from '@/views/main/components/move.vue'
import { getAllDirectoryApi, MoveFileOrDirectoryApi } from '@/apis/directory.ts'
import type { GetAllDirectoryData, MoveFileBody } from '@/apis/types/directory.ts'
import Navigation from '@/components/navigation/index.vue'
import { controlFileType } from '@/data/upload.ts'

const route = useRoute()
const currentSecondMenuCategory = ref()
const emits = defineEmits(['addFile'])
const HomeData = ref<any>([])
const UserStore = useUserInfo()

const title = ref('')

//=====================上传================================
const uploadHandler = async (file: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  emits('addFile', { file: file, filePid: file.uid })
  return false
}
const editRef = ref()
const addStatus = ref(false)
//新建文件夹
const newItem = ref({
  key: new Date(),
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
//=========================================================

//======================添加文件夹===========================
const add = async (index: number) => {
  newItem.value.name = ''
  //判断是否有重命名,有重命名的话就返回
  if (DelOrEditName.value === DelOrEditNameEnum.EDIT_NAME) {
    message.warn('请先修改文件名,之后再创建新的文件')
    return
  }
  DelOrEditName.value = DelOrEditNameEnum.DEL
  confirmStatus.value = CONFIRM_STATUS.ADD_FOLDER
  //如果已经添加了新的文件了
  if (addStatus.value) {
    message.warn('请填写文件名')
    return
  }
  addStatus.value = true
  HomeData.value.splice(index, 0, newItem.value)
  nextTick(() => {
    editRef.value.focus()
  })
}
//========================================================

/**
 * 新建文件夹和重命名
 */

enum CONFIRM_STATUS {
  ADD_FOLDER = 0,
  RENAME_FILE = 1,
  RESET = 3
}

const confirmStatus = ref(CONFIRM_STATUS.RESET)
const path = ref((route.query as { path: string }).path)
const addFolder = async (addIndex: number, index: number) => {
  //判断是重命名还是添加文件夹
  if ((confirmStatus.value as any) === CONFIRM_STATUS.ADD_FOLDER) {
    if (newItem.value.name.indexOf('/') !== -1) {
      message.error('不能含有/等特殊字符')
      return
    }
    const param: AddFolderDataType = {
      fileId: '',
      filePid: path.value.indexOf('/')
        ? path.value.split('/')[path.value.split('/').length - 1]
          ? path.value.split('/')[path.value.split('/').length - 1]
          : 0
        : path.value,
      name: newItem.value.name,
      user_id: UserStore.userInfo._id
    }
    const res = await addFolderApi(param)
    if (res.code === 0) {
      message.success('创建成功')
      //显示这个文件
      HomeData.value[addIndex].showEdit = false
      addStatus.value = false
      newItem.value = {
        key: new Date(),
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
  } else if ((confirmStatus.value as any) === CONFIRM_STATUS.RENAME_FILE) {
    await RenameFile(addIndex + index)
  }
  //进行重置
  DelOrEditName.value = DelOrEditNameEnum.REST
  confirmStatus.value = CONFIRM_STATUS.RESET
  addStatus.value = false
}
//====================重命名===============================
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
    HomeData.value[index].name = newItem.value.name
  } else {
    message.error(res.message)
  }
}
//==============================================================
//定义是删除新建的文件夹还是重命名
enum DelOrEditNameEnum {
  DEL = 0,
  EDIT_NAME = 1,
  REST = 3
}
const DelOrEditName = ref(DelOrEditNameEnum.REST)
//=========================================删除文件名================
const cancelFolder = (index: number) => {
  //清空数据
  newItem.value.name = ''
  //如果是重命名的话就
  if ((DelOrEditName.value as any) === DelOrEditNameEnum.EDIT_NAME) {
    HomeData.value[index].showEdit = false
  } else if ((DelOrEditName.value as any) === DelOrEditNameEnum.DEL) {
    HomeData.value.splice((pagation.value - 1) * 15, 1)
  }
  //进行重置
  DelOrEditName.value = DelOrEditNameEnum.REST
  confirmStatus.value = CONFIRM_STATUS.RESET
  addStatus.value = false
}
// ===================================================================
//========================批量删除============================

const ids = ref([''])
const selectedRowKey = ref<any>([])
const rowSelection = ref({
  selectedRowKeys: selectedRowKey,
  onChange: (selectedRowKeys: Key[]) => {
    console.log(selectedRowKeys)
    selectedRowKey.value = selectedRowKeys
  },
  onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
    //存储id,一个一个的选择
    ids.value = selectedRows.map((selectedRow) => selectedRow._id)
  },
  onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
    ids.value = selectedRows.map((selectedRow) => selectedRow._id)
  }
})

const multipleDelete = () => {
  //删除弹窗
  try {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要删除吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        multipleDeleteApi(ids.value).then(async (res) => {
          if (res.code === 0) {
            selectedRowKey.value = []
            message.success('删除成功')
            await getAllFile()
          }
        })
      },
      onCancel() {},
      bodyStyle: {
        padding: '0px 20px'
      },
      wrapClassName: 'modal'
    })
  } catch (e) {
    message.error(e as unknown as string)
  }
}

//========================================================

//=========================分享===============================
const share = () => {
  console.log('分享')
}
//============================================================

//==============删除文件夹======================
const del = async (index: number) => {
  //删除文件夹
  const param = ref<DeleteFileDataType>({
    fileId: HomeData.value[index]._id
  })
  const res = await deleteFileApi(param.value)
  if (res.code === 0) {
    message.success('删除成功')
    //将这个数据删除
    HomeData.value.splice(index, 1)
  }
}
const rename = ref<string | number>('')

//==========重命名edit===========================
const edit = (index: number) => {
  //重命名
  DelOrEditName.value = DelOrEditNameEnum.EDIT_NAME
  confirmStatus.value = CONFIRM_STATUS.RENAME_FILE
  //点击重命名如果其他的也在这个重命名其他的先消失，这个先显示
  if (rename.value) {
    HomeData.value[rename.value as number].showEdit = false
  }
  rename.value = index
  if (addStatus.value && HomeData.value[0].showEdit) {
    //删除这个数据
    HomeData.value.shift()
    HomeData.value[0].showEdit = false
    index = index - 1
  }
  HomeData.value?.forEach((item: any) => {
    item.showEdit = false
  })
  newItem.value.name = ''
  HomeData.value[index].showEdit = true
  nextTick(() => {
    editRef.value.focus()
  })
}
//==============================================

//========================移动===================

const openMove = ref(false)
const closeMove = () => {
  openMove.value = false
}
//获取文件的信息,查询出id来
const getFileInfo = computed(() => {
  return (
    HomeData.value
      .filter((item: any) => {
        return item._id === ids.value[0]
      })
      .map((am: any) => am.filePid) as string
  )[0]
})

const directoryList = ref([] as GetAllDirectoryData)
//获取文件夹的信息，打开弹窗
const getAllDirectory = async () => {
  try {
    const res = await getAllDirectoryApi(
      UserStore.userInfo._id as string,
      getFileInfo.value as number | string
    )
    directoryList.value = res.data
    openMove.value = true
  } catch (e) {
    console.log(e, '获取全部目录')
  }
}
const currentId = ref([''])
const moveSingle = async (data: any) => {
  //查询相应的文件信息，判断文件是否有file_pid来筛选目录
  currentId.value = [data._id]
  await getAllDirectory()
}

const moveMany = async () => {
  await getAllDirectory()
}

//进行移动
const moveFileOrDirectory = (folderId: string) => {
  if (currentId.value[0] === folderId) {
    message.error('已经在当前目录了')
    return
  }
  //进行移动
  if (currentId.value) {
    MoveFileOrDirectoryApi({ fileId: currentId.value, folderId: folderId })
  } else if (ids.value.length) {
    MoveFileOrDirectoryApi({ fileId: ids.value, folderId: folderId })
  }
  openMove.value = false
}

//==============================================

//获取所有文件==============================================================
const pageSize = ref(100)
const page = ref(1)
const fileId = ref('')
//进行一下映射
enum FILETYPE {
  video = 1,
  music = 2,
  image = 3,
  doc = 5,
  other = 10
}
const getAllFileparam = reactive({
  page: page.value,
  pageSize: pageSize.value,
  fileType: null,
  fileId: fileId.value,
  title: ''
})
const getAllFile = async () => {
  getAllFileparam.title = title.value
  const res = await getAllFileApi(getAllFileparam)
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
      filePid: item.filePid ? item.filePid : 0,
      fileCover: item.file_cover ? item.file_cover : ''
    }
  })
}
//===========================================================================

//=====================得到分页数===============================
const pagation = ref(1)
const getPagation = (index: number) => {
  pagation.value = index
}
//==============================================================

onMounted(() => {
  getAllFile()
})

//============================预览===================================
const navigationRef = ref()
const handlePreview = (record: any) => {
  //是目录
  if (record.folder_type === 1) {
    navigationRef.value.openFolder({
      filename: record.name,
      fileId: record._id
    })
  }
}
const navChange = (data: { categoryId: number; currentFolder: { fileId: string } }) => {
  const { currentFolder } = data
  //获取到当前的文件夹的id
  getAllFileparam.fileId = currentFolder.fileId
  //获取到文件信息
  getAllFile()
}

watch(
  () => route,
  (newValue) => {
    path.value = newValue.query.path as any
    currentSecondMenuCategory.value = newValue.params.category
    if ((path.value as any) == undefined) {
      getAllFileparam.fileId = null as any
      getAllFileparam.fileType = (FILETYPE as any)[route.params.category as string]
    }
    getAllFile()
  },
  {
    immediate: true,
    deep: true
  }
)
//#region
const handleSearch = () => {
  getAllFile()
}
//#endregion

const acceptFile = computed(() => {
  const categoryItem = (controlFileType as any)[(route.params as any).category]
  return categoryItem.accept ? categoryItem.accept : '*'
})
defineExpose({ getAllFile })
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <!--    头部-->
    <div class="flex items-center space-x-2 w-[100%]">
      <a-upload :showUploadList="false" :beforeUpload="uploadHandler" :accept="acceptFile">
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
        @click="add((pagation - 1) * 15)"
      >
        <template #icon>
          <FolderOpenOutlined />
        </template>
        新建文件夹
      </a-button>
      <a-button
        type="primary"
        danger
        :disabled="selectedRowKey.length === 0"
        @click="multipleDelete"
      >
        <template #icon>
          <span class="iconfont icon-del mr-[10px] text-[15px]"></span>
        </template>
        批量删除
      </a-button>
      <a-button
        class="bg-amber-500 text-white border-[white] hover:opacity-60 h-[35px] move"
        :disabled="selectedRowKey.length === 0"
        @click="moveMany"
      >
        <template #icon>
          <span class="iconfont icon-move text-[15px] mr-[10px]"></span>
        </template>
        批量移动
      </a-button>
      <!--      搜索-->
      <a-input-search
        @keyup.enter="handleSearch"
        class="xl:w-[25%]"
        placeholder="输入文件名搜索"
        allowClear
        @search="handleSearch"
        v-model:value="title"
      ></a-input-search>
      <i class="iconfont icon-refresh cursor-pointer" @click="getAllFile"></i>
    </div>
    <!--    全部文件-->
    <!--    <div class="mt-[10px] mb-[15px] text-[#636D7E] text-[13px]" style="font-weight: 800">-->
    <!--      全部文件-->
    <!--    </div>-->
    <!--    导航-->
    <div class="mb-[10px] mt-[10px]">
      <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
    </div>
    <!--    文件展示-->
    <MyTable
      :columns="HomeColumns"
      :data="HomeData"
      :pagination="true"
      :page-size="15"
      :ext-height="80"
      :add="true"
      :row-selection="rowSelection"
      @change="getPagation"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <div class="flex justify-between">
            <div
              v-if="!record.showEdit"
              class="items-center flex cursor-pointer"
              @click="handlePreview(record)"
            >
              <!--              判断是否为图片或者音频-->
              <template v-if="record.file_type === 1 || record.file_type === 3">
                <Icon :cover="HomeData[(pagation - 1) * 15 + index].fileCover"></Icon>
              </template>
              <template v-else>
                <!--              判断是否为folder-->
                <Icon v-if="record.folder_type === 0" :file-type="record.file_type"> </Icon>
                <Icon v-if="record.folder_type === 1" :file-type="0"></Icon>
              </template>
              <div class="ml-[10px] cursor-pointer">
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
                @click="cancelFolder((pagation - 1) * 15 + index)"
              />
              <CheckSquareFilled
                class="text-[25px] text-[#05A1F7] cursor-pointer confirm"
                @click="addFolder((pagation - 1) * 15, index)"
              />
            </div>
            <div style="display: none" class="hover-v1" v-if="!record.showEdit">
              <Hover
                :data="HomeHoverData"
                @share1="share"
                @del="del((pagation - 1) * 15 + index)"
                @edit="edit((pagation - 1) * 15 + index)"
                @move="moveSingle(record)"
              ></Hover>
            </div>
          </div>
        </template>
      </template>
    </MyTable>
    <!--    移动-->
    <Move
      :open="openMove"
      :data="directoryList"
      @close="closeMove"
      @moveFileOrDirectory="moveFileOrDirectory"
    ></Move>
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
