<script setup lang="ts">
import { StopOutlined } from '@ant-design/icons-vue'
import { shareColume, ShareHoverData } from '@/data/share.ts'
import { onMounted, ref } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import { cancelShareFileApi, getShareFileListApi } from '@/apis/share.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
import moment from 'moment'
import Icon from '@/components/icon/index.vue'
import useClipboard from 'vue-clipboard3'
import { imageUrlBase, UrlBase } from '@/data/common.ts'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const selectedRowKey = ref<any>([])
const selectIds = ref<any>()
const rowSelection = ref({
  selectedRowKeys: selectedRowKey,
  onChange: (selectedRowKeys: Key[]) => {
    selectedRowKey.value = selectedRowKeys
  },
  onSelect: (record: any, selected: boolean, selectedRows: any) => {
    selectIds.value = selectedRows.map((selectedRow: any) => selectedRow.id)
  },
  onSelectAll: (selected: boolean, selectedRows: any) => {
    selectIds.value = selectedRows.map((selectedRow: any) => selectedRow.id)
  }
})
const userStore = useUserInfo()

const { toClipboard } = useClipboard()
const link = async (fileInfo: any) => {
  await toClipboard(`链接为:${UrlBase + 'shareCheck/' + fileInfo.fileId},提取码为${fileInfo.code}`)
  message.success('复制成功')
}
const cancel = async (fileInfo: any) => {
  try {
    const res = await cancelShareFileApi([fileInfo.id])
    if (res.code === 0) {
      const result = await getShareFileListApi((userStore.userInfo as { _id: string })._id)
      shareList.value = result.data
      await message.success('取消分享成功')
    }
  } catch (e) {
    console.log(e, '取消分享失败')
  }
}
const cancelMany = async () => {
  try {
    const res = await cancelShareFileApi(selectIds.value)
    if (res.code === 0) {
      const result = await getShareFileListApi((userStore.userInfo as { _id: string })._id)
      shareList.value = result.data
      message.success('取消分享成功')
    }
  } catch (e) {
    console.log(e, '批量取消分享失败')
  }
}
//获取分享列表
const shareList = ref()
const getShareList = async () => {
  const res = await getShareFileListApi((userStore.userInfo as any)._id)
  const data = res.data.map((item, index) => {
    if (item) {
      return {
        id: item.id,
        key: index,
        name: item.fileName,
        time: moment(Number(item.createTime)).format('YYYY-MM-DD'),
        unValid: item.validTime,
        number: item.viewCount,
        fileType: item.fileType,
        folderType: item.folderType,
        filePath: item.filePath,
        code: item.code,
        fileId: item.fileId
      }
    }
  })
  shareList.value = data
}
onMounted(() => {
  getShareList()
})
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <div>
      <a-button type="primary" :disabled="!selectedRowKey.length" @click="cancelMany">
        <template #icon>
          <StopOutlined />
        </template>
        {{ $t('share.cancel') }}
      </a-button>
    </div>
    <div class="mt-[10px] mb-[15px] text-[#636D7E] text-[13px]" style="font-weight: 800">
      {{ $t('navigator.all') }}
    </div>
    <MyTable
      :data="shareList"
      :ext-height="77"
      :columns="shareColume"
      pagination
      :page-size="15"
      :add="true"
      :row-selection="rowSelection"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <div class="flex justify-between">
            <div class="flex justify-between items-center">
              <div class="items-center flex cursor-pointer">
                <!--              判断是否为图片或者音频-->
                <template v-if="record.file_type === 1 || record.file_type === 3">
                  <Icon></Icon>
                </template>
                <template v-else>
                  <!--              判断是否为folder-->
                  <Icon v-if="record.folderType == 0" :file-type="record.fileType"> </Icon>
                  <Icon v-if="record.folderType == 1" :file-type="0"></Icon>
                </template>
                <div class="ml-[10px] cursor-pointer">
                  {{ (record as any).name }}
                </div>
              </div>
            </div>
            <!--            hover-->
            <div style="display: none" class="hover-v1">
              <Hover
                :type="1"
                :data="ShareHoverData"
                @cancel="cancel(record)"
                @link="link(record)"
                :file-info="record"
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
</style>
