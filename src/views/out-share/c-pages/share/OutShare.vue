<script setup lang="ts">
import { useUserInfo } from '@/stores/userInfo'
import { avatarImageUrl, imageUrlBase } from '@/data/common'
import MyTable from '@/components/table/index.vue'
import { outShareColumn, OutShareHoverData } from '@/data/out-share'
import Icon from '@/components/icon/index.vue'
import Hover from '@/components/hover/index.vue'
import { cancelShareFileApi, getOutShareListApi, getShareInfoApi } from '@/apis/share'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { ShareInfoData } from '@/apis/types/share'
import moment from 'moment'
import type { DataItem } from '@/data/home'
import { message } from 'ant-design-vue'
import Modal from '@/components/ant-modal/ant-modal.vue'
import { getAllDirectoryApi, getSubCategoryApi, MoveFileOrDirectoryApi } from '@/apis/directory'
import type { GetAllDirectoryData } from '@/apis/types/directory'
import Navigation from '@/components/navigation/index.vue'

const userStore = useUserInfo()
const route = useRoute()
const router = useRouter()
const ShareInfo = ref({} as ShareInfoData)
const getShareInfo = async () => {
  try {
    const res = await getShareInfoApi(route.params.shareId as string)
    if (res.code === 0) {
      ShareInfo.value = res.data
    }
  } catch (e) {
    console.log(e, '获取分享信息接口错误')
  }
}
const outShareList = ref()
const getOutShareList = async () => {
  try {
    const res = await getOutShareListApi(route.params.shareId as string)
    if (res.code === 0) {
      outShareList.value = res.data
    }
  } catch (e) {
    console.log(e, '获取外部分享列表接口错误')
  }
}

//下载文件
const download = (fileInfo: any) => {
  window.location.href = imageUrlBase + fileInfo.filePath
}

//多选
const selectedRowKey = ref([] as number[])
const ids = ref([] as string[])
const rowSelections = ref({
  selectedRowKeys: selectedRowKey,
  onChange: (selectedRowKeys: number[]) => {
    selectedRowKey.value = selectedRowKeys
  },
  onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
    //存储id,一个一个的选择
    ids.value = selectedRows.map((selectedRow) => (selectedRow as unknown as { id: string }).id)
  },
  onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
    ids.value = selectedRows.map((selectedRow) => (selectedRow as unknown as { id: string }).id)
  }
})
//取消分享
const cancelShare = async () => {
  await router.push({
    path: '/main/all'
  })
  await message.success('取消分享成功')
}

//移动网盘
const open = ref(false)
//获取用户的文件夹
const userFolder = ref([] as GetAllDirectoryData)
const navigationRef = ref()
const getUserFolder = async () => {
  const res = await getAllDirectoryApi(0)
  userFolder.value = res.data
}
const showModal = () => {
  open.value = true
}
const cancelModal = () => {
  open.value = false
}
//移动文件
const fileId = ref('')
const gotoDetail = (Id: string, type: number) => {
  if (type === 0) {
    return
  }
  fileId.value = Id
  navigationRef.value.openFolder({ filename: '', fileId: Id })
}
const move = () => {
  try {
    MoveFileOrDirectoryApi({ filePid: fileId.value, ids: ids.value }).then((res) => {
      if (res.code === 0) {
        cancelModal()
        message.success(res.message)
        getUserFolder()
      } else {
        message.error('移动失败')
      }
    })
  } catch (e) {
    console.log(e, '移动文件的接口出错了')
  }
}
const moveMyPan = () => {
  showModal()
  getUserFolder()
}

//移动文件
const navChange = () => {
  //获取目录下的内容,ids
  try {
    getSubCategoryApi(fileId.value, ids.value).then((res) => {
      if (res.code === 0) {
        userFolder.value = res.data
      }
    })
  } catch (e) {
    console.log(e, '获取子目录的接口出错了')
  }
}

//取消分享
onMounted(() => {
  getShareInfo()
  getOutShareList()
})
</script>

<template>
  <!--  header-->
  <header class="bg-[#028DFA] pt-[10px] pb-[10px]">
    <div class="text-white text-[20px] w-[70%] m-auto">Merikle云盘</div>
  </header>
  <!--  用户-->
  <div
    class="flex items-center justify-between w-[70%] m-auto"
    style="border-bottom: 0.5px solid #cccccc; padding-bottom: 10px"
  >
    <div class="mt-[20px]">
      <div class="flex">
        <img
          :src="avatarImageUrl + userStore.userInfo.avatar"
          alt="用户头像"
          class="w-[40px] h-[40px]"
          style="border-radius: 100%"
        />
        <div class="ml-[10px] items-center">
          <div>
            <span class="mr-[10px] text-[15px]">
              {{ (userStore.userInfo as any).nick_name }}
            </span>
            <span>分享于:{{ moment(Number(ShareInfo.time)).format('YYYY-MM-DD') }}</span>
          </div>
          <div class="text-[14px] mt-[10px]">分享文件:{{ ShareInfo.fileName }}</div>
        </div>
      </div>
    </div>
    <div>
      <!--      判断是否为用户的网盘-->
      <a-button
        type="primary"
        @click="cancelShare"
        v-if="userStore.userInfo._id === ShareInfo.userId"
        >取消分享</a-button
      >
      <a-button type="primary" @click="moveMyPan" v-else>移动到我的网盘</a-button>
    </div>
  </div>
  <!--  文件内容-->
  <div class="w-[70%] m-auto">
    <MyTable
      :add="true"
      :row-selection="rowSelections"
      :data="outShareList"
      :ext-height="72"
      :columns="outShareColumn"
      :pagination="true"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'name'">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <!--      视频或者图片    -->
              <div v-if="record.fileType === 1">
                <Icon></Icon>
              </div>
              <!--          其他-->
              <div>
                <Icon v-if="record.folderType === 1" :file-type="0"></Icon>
                <Icon v-else :file-type="record.fileType"></Icon>
              </div>
              <div>{{ record.name }}</div>
            </div>
            <!--          hover-->
            <div style="display: none" class="hover-v1">
              <Hover
                :data="OutShareHoverData"
                file-info=""
                type="outShare"
                @download="download(record)"
              ></Hover>
            </div>
          </div>
        </template>
      </template>
    </MyTable>
    <!--    显示弹窗-->
    <template v-if="open">
      <Modal
        :btn-other-show="false"
        :open="open"
        title="移动到"
        show-cancel
        :ok-btn="{
          text: '移动'
        }"
        @close="cancelModal"
        @ok="move"
      >
        <!--      显示用户的文件夹-->
        <template #default>
          <Navigation
            ref="navigationRef"
            :is-watch-path="false"
            @navChange="navChange"
          ></Navigation>
          <div
            v-for="item in userFolder"
            :key="item._id"
            class="modal-file"
            @click="gotoDetail(item._id, item.folder_type)"
          >
            <div class="flex items-center h-[50px]">
              <!--            icon-->
              <template v-if="item.file_type === 1 || item.file_type === 3">
                <Icon :cover="item.file_name"></Icon>
              </template>
              <template v-else>
                <!--              判断是否为folder-->
                <Icon v-if="item.folder_type === 0" :file-type="item.file_type"> </Icon>
                <Icon v-if="item.folder_type === 1" :file-type="0"></Icon>
              </template>
              <div class="ml-[5px]">
                {{ item.file_name }}
              </div>
            </div>
          </div>
        </template>
      </Modal>
    </template>
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
.modal-file {
  margin-top: 10px;
  cursor: pointer;
  &:hover {
    background-color: #cccccc;
  }
}
</style>
