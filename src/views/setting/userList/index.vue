<script setup lang="ts">
import { ref } from 'vue'
import MyTable from '@/components/table/index.vue'
const selected = ref()
const value1 = ref('lucy')

//用户列表
const UserList = ref()
const columData = ref([
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '空间使用',
    dataIndex: 'useSpace',
    key: 'useSpace'
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
    key: 'joinTime'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime'
  }
])
</script>

<template>
  <div>
    <!--    查询栏-->
    <div class="flex flex-row items-center pl-[20px] pt-[20px]">
      <div class="flex flex-row items-center mr-[20px]">
        <label class="mr-[10px] shrink-0">用户昵称</label>
        <a-input placeholder="支持模糊搜索"></a-input>
      </div>
      <div class="flex flex-row mr-[10px] items-center">
        <label class="mr-[10px] shrink-0">状态</label>
        <a-select ref="select" v-model:value="value1" style="width: 200px">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled" disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
      </div>
      <a-button type="primary">查询</a-button>
    </div>
    <!--    table-->
    <div class="mt-[20px]">
      <MyTable :add="true" row-selection="" data="" ext-height="" :columns="columData"></MyTable>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
