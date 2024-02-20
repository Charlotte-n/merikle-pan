<script setup lang="ts">
import { UploadOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Hover from '@/components/hover/index.vue'
import { HomeColumns, HomeData, HomeHoverData } from '@/data/home.ts'
const route = useRoute()
const currentSecondMenuCategory = ref()
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
</script>

<template>
  <div class="pt-[20px] pl-[20px] pr-[20px]">
    <!--    头部-->
    <div class="flex items-center space-x-2 w-[100%]">
      <a-upload :multiple="false">
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
      >
        <template #icon>
          <FolderOpenOutlined />
        </template>
        新建文件夹
      </a-button>
      <a-button type="primary" danger>
        <template #icon>
          <span class="iconfont icon-del mr-[10px] text-[15px]"></span>
        </template>
        批量删除
      </a-button>
      <a-button class="bg-amber-500 text-white border-[white] hover:opacity-60 h-[35px]">
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
      class="text-[#9EB4D4] table-1"
      :pagination="true"
      :page-size="15"
      :ext-height="80"
    >
      <template #hover>
        <Hover :data="HomeHoverData" @share1="share" @del="del" @edit="edit" @move="move"></Hover>
      </template>
    </MyTable>
  </div>
</template>

<style scoped lang="scss">
:global(.table-1 .ant-table-cell) {
  color: #909399 !important;
}
</style>
