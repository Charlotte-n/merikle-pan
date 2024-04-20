<script setup lang="ts">
import { PlusOutlined, ImportOutlined } from '@ant-design/icons-vue'
import MyTable from '@/components/table/index.vue'
import { CommonFileColumnType } from '@/data/common-file.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
//data
const data = ref([
  {
    key: 1,
    name: '小说',
    owner: 'Merikle',
    edit: '2024-05-04',
    type: 'word',
    category: 'Common'
  }
])
const RowClick = (id: string) => {
  const { href } = router.resolve({
    path: '/commonWord/' + id
  })
  window.open(href, '_blank')
}

//打开弹窗
const visible = ref(false)
const handleVisible = () => {
  visible.value = !visible.value
}
</script>

<template>
  <div class="container">
    <header class="flex pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
      <div>
        <a-button type="primary" class="mr-[20px]" @click="handleVisible">
          <template #icon>
            <PlusOutlined style="font-size: 18px" />
          </template>
          新建
        </a-button>
        <a-card class="mt-[4px] absolute" style="z-index: 20" v-if="visible">
          <div class="text-[15px]" style="font-weight: 600">新建</div>
          <div class="flex mt-[10px]">
            <div class="">
              <div class="text-[12px]">专业文档</div>
              <div class="mt-[10px] flex">
                <div class="mr-[30px] cursor-pointer">
                  <img class="w-[30px] h-[30px]" alt="" src="@/assets/icon-image/word.png" />
                  <div class="mt-[5px] text-[10px]">文档</div>
                </div>
                <div class="mr-[30px] cursor-pointer">
                  <img class="w-[30px] h-[30px]" alt="" src="@/assets/icon-image/excel.png" />
                  <div class="mt-[5px] text-[10px]">表格</div>
                </div>
                <div>
                  <img
                    class="w-[30px] h-[30px] cursor-pointer"
                    alt=""
                    src="@/assets/icon-image/PPT.png"
                  />
                  <div class="mt-[5px] text-[10px]">幻灯片</div>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <a-button>
        <template #icon>
          <ImportOutlined style="font-size: 18px" />
        </template>
        导入
      </a-button>
    </header>
    <!--    内容-->
    <section class="mt-[20px]">
      <MyTable
        :add="true"
        :data="data"
        ext-height=""
        :columns="CommonFileColumnType"
        @rowClick="RowClick"
      >
      </MyTable>
    </section>
  </div>
</template>

<style scoped lang="scss">
:deep(.ant-popover-inner) {
  padding: 20px;
}
</style>
