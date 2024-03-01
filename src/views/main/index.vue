<script setup lang="ts">
import {
  UploadOutlined,
  FolderOpenOutlined,
  CloseSquareFilled,
  CheckSquareFilled
} from '@ant-design/icons-vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Hover from '@/components/hover/index.vue'
import { HomeColumns, HomeHoverData } from '@/data/home.ts'
import { getAllFileApi } from '@/apis/file.ts'
const route = useRoute()
const currentSecondMenuCategory = ref()
const emits = defineEmits(['addFile'])
const HomeData = ref([])
import moment from 'moment'
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
const add = () => {
  if (addStatus.value) {
    return
  }
  const newItem = {
    key: 3,
    name: '',
    time: '',
    size: '',
    showEdit: true
  }
  HomeData.value.unshift(newItem)
  nextTick(() => {
    editRef.value.focus()
  })
  addStatus.value = true
  console.log(HomeData)
}

//删除文件名
const cancelFloder = () => {
  HomeData.value.shift()
  addStatus.value = false
}
const share = () => {
  console.log('分享')
}
const del = () => {
  console.log('删除')
}
const edit = () => {
  console.log('重命名')
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
      showEdit: false
    }
  })
  console.log(HomeData.value)
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
      <i class="iconfont icon-refresh cursor-pointer"></i>
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
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="flex justify-between">
            <div v-if="!record.showEdit">
              {{ record.name }}
            </div>
            <div v-if="record.showEdit" class="flex justify-center items-center">
              <a-input class="mr-[20px] w-[400px]" ref="editRef"></a-input>
              <CloseSquareFilled
                class="mr-[10px] text-[25px] text-[#05A1F7] cursor-pointer close"
                @click="cancelFloder"
              />
              <CheckSquareFilled class="text-[25px] text-[#05A1F7] cursor-pointer confirm" />
            </div>
            <div style="display: none" class="hover-v1" v-if="!record.showEdit">
              <Hover
                :data="HomeHoverData"
                @share1="share"
                @del="del"
                @edit="edit"
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
