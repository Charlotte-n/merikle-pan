<script setup lang="ts">
import { ref } from 'vue'
import MyTable from '@/components/table/index.vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { DataItem } from '@/data/home.ts'

//#region table
const columnData = ref([
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '发布人',
    dataIndex: 'people',
    key: 'people'
  },
  {
    title: '修改时间',
    dataIndex: 'time',
    key: 'time'
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size'
  }
])

const FileListData = ref([
  {
    name: '小米',
    people: 'Merikle',
    time: '2024-05-04',
    size: 123
  }
])

//多选
const ids = ref([''])
const selectedRowKey = ref<any>([])
const rowSelection = ref({
  selectedRowKeys: selectedRowKey,
  onChange: (selectedRowKeys: Key[]) => {
    selectedRowKey.value = selectedRowKeys
  },
  onSelect: (record: DataItem, selected: boolean, selectedRows: any) => {
    //存储id,一个一个的选择
    ids.value = selectedRows.map((selectedRow: any) => (selectedRow as { _id: string })._id)
  },
  onSelectAll: (selected: boolean, selectedRows: any) => {
    ids.value = selectedRows.map((selectedRow: any) => (selectedRow as { _id: string })._id)
  }
})
//#endregion

//#region 搜索
const title = ref()
const handleSearch = () => {}
//#endregion

//#region 文件列表

//#endregion
</script>

<template>
  <div>
    <!--  头部搜索栏-->
    <div class="pl-[20px] pt-[20px] flex items-center">
      <a-input-search
        v-model:value="title"
        placeholder="输入文件名搜索"
        style="width: 25%"
        @search="handleSearch"
      />
      <span class="iconfont icon-refresh ml-[10px] mr-[10px] cursor-pointer"></span>
      <a-button danger type="primary" class="items-center flex" :disabled="ids.length">
        <i class="icon-del iconfont mr-[5px]"></i>
        批量删除
      </a-button>
    </div>
    <!--    文件列表-->
    <div class="mt-[20px]">
      <MyTable
        :add="true"
        :row-selection="rowSelection"
        :data="FileListData"
        :ext-height="80"
        :columns="columnData"
        :pagination="true"
      ></MyTable>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
