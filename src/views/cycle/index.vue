<script setup lang="ts">
import { CycleColumn, CycleHoverData } from '@/data/cycle.js'
import { completeDeleteApi, getRecycleListApi, revertFileApi } from '@/apis/recycle.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
import { onMounted, ref } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import Icon from '@/components/icon/index.vue'
import type { RecycleSingleType } from '@/apis/types/recycle.ts'
import { message } from 'ant-design-vue'
import { imageUrlBase } from '@/data/common.ts'
import { getUserSpaceApi } from '@/apis/user.ts'

const userStore = useUserInfo()
const selectedRowKey = ref<any>([])
const ids = ref<any>([])
const fileSize = ref<any>([])
//多选
const rowSelection = ref({
  selectedRowKeys: selectedRowKey,
  onChange: (selectedRowKeys: Key[]) => {
    selectedRowKey.value = selectedRowKeys
  },
  onSelect: (record: RecycleSingleType, selected: boolean, selectedRows: RecycleSingleType[]) => {
    ids.value = selectedRows.map((selectedRow: any) => selectedRow.id)
    fileSize.value = selectedRows.map((selectedRow: any) => Number(selectedRow.size))
  },
  onSelectAll: (
    selected: boolean,
    selectedRows: RecycleSingleType[],
    changeRows: RecycleSingleType[]
  ) => {
    ids.value = selectedRows.map((selectedRow: any) => selectedRow.id)
    fileSize.value = selectedRows.map((selectedRow: any) => Number(selectedRow.size))
  }
})

//还原单个文件
const revert = async (fileInfo: RecycleSingleType) => {
  try {
    const res = await revertFileApi([fileInfo.id])
    if (res.code === 0) {
      message.success('还原成功')
      await getRecycleList()
    }
  } catch (e) {
    console.log(e, '还原文件的接口出错了')
  }
}

//批量还原
const revertMany = async () => {
  try {
    const res = await revertFileApi(ids.value)
    if (res.code === 0) {
      message.success('还原成功')
      await getRecycleList()
    }
  } catch (e) {
    console.log(e, '还原文件的接口出错了')
  }
}
//单文件删除
const del = async (fileInfo: RecycleSingleType) => {
  try {
    const res = await completeDeleteApi([fileInfo.id])
    if (res.code === 0) {
      message.success('删除成功')
      await updateUserSpace([Number(fileInfo.size)])
      await getRecycleList()
    }
  } catch (e) {
    console.log(e, '回收站删除接口出错了')
  }
}
//批量删除
const deleteMany = async () => {
  try {
    const res = await completeDeleteApi(ids.value)
    if (res.code === 0) {
      message.success('删除成功')
      await updateUserSpace(fileSize.value)
      await getRecycleList()
    }
  } catch (e) {
    console.log(e, '回收站删除接口出错了')
  }
}

//更新用户列表
const updateUserSpace = async (size: number[]) => {
  try {
    await getUserSpaceApi(userStore.userInfo._id, 2, size)
    //重新获取用户的空间信息
    await getUserSpaceApi(userStore.userInfo._id)
  } catch (e) {
    console.log(e, '更新用户空间接口错误')
  }
}

//获取列表
const recycleList = ref()
const getRecycleList = async () => {
  const res = await getRecycleListApi(userStore.userInfo._id)
  recycleList.value = res.data.map((item, index) => {
    ;(item as any)['key'] = index
    return item
  })
}
onMounted(() => {
  getRecycleList()
})
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <div class="mb-[20px]">
      <a-button
        class="mr-[10px] bg-[#67C23A] text-white border-white"
        style="line-height: 1"
        :disabled="ids.length === 0"
        @click="revertMany"
      >
        <template #icon>
          <span class="iconfont icon-revert mr-[5px]"></span>
        </template>
        还原
      </a-button>
      <a-button danger type="primary" :disabled="ids.length === 0" @click="deleteMany">
        <template #icon>
          <span class="iconfont icon-del mr-[5px] text-[13px]"></span>
        </template>
        批量删除
      </a-button>
    </div>
    <MyTable
      :data="recycleList"
      :ext-height="78"
      :columns="CycleColumn"
      :row-selection="rowSelection"
      :add="true"
      pagination
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <div class="flex items-center justify-between">
            <!--            如果为图片或者音频-->
            <div class="flex items-center">
              <template v-if="record.fileType === 1 || record.fileType === 3">
                <Icon :cover="record.path"></Icon>
              </template>
              <template v-else>
                <Icon v-if="record.folderType === 0" :file-type="record.fileType"></Icon>
                <Icon v-if="record.folderType === 1" :file-type="0"></Icon>
              </template>
              <div class="ml-[10px]">
                {{ (record as RecycleSingleType).name }}
              </div>
            </div>
            <div style="display: none" class="hover-v1">
              <Hover
                :data="CycleHoverData"
                @revert="revert(record)"
                @del="del(record)"
                file-info=""
                type="cycle"
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
