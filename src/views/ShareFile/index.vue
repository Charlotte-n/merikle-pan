<script setup lang="ts">
import { PlusOutlined, ImportOutlined } from '@ant-design/icons-vue'
import MyTable from '@/components/table/index.vue'
import { CommonFileColumnType } from '@/data/common-file.ts'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CreateFileApi, GetFileListApi } from '@/apis/commonFile.ts'
import type { uploadFileType } from '@/apis/types/commonFile.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
import { message } from 'ant-design-vue'

const router = useRouter()
const userInfo = useUserInfo()
enum CATEGORY {
  WORD = 1,
  EXCEL = 2,
  PPT = 3
}
const RowClick = (id: string) => {
  console.log('123', '我获取的内容为')
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

//#region 创建文档
const createWord = async (category: number) => {
  const param = ref<uploadFileType>({
    category,
    content: '',
    userId: userInfo.userInfo._id
  } as unknown as uploadFileType)
  try {
    const res = await CreateFileApi(param.value)
    if (res.code === 0) {
      message.success('创建成功')
      await getFileList()
    }
  } catch (e) {
    console.log(e, '创建文件的接口出错了')
  }
}

//#endregion

//#region 获取文档列表
const data = ref([] as { key: number; name: string; edit: string; owner: string; id: string }[])
const getFileList = async () => {
  try {
    const result = await GetFileListApi(userInfo.userInfo._id)
    data.value = result.data
  } catch (e) {
    console.log(e, '获取文档列表接口出错了')
  }
}
//endregion
onMounted(() => {
  getFileList()
})
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
                <div class="mr-[30px] cursor-pointer" @click="createWord(CATEGORY.WORD)">
                  <img class="w-[30px] h-[30px]" alt="" src="@/assets/icon-image/word.png" />
                  <div class="mt-[5px] text-[10px]">文档</div>
                </div>
                <div class="mr-[30px] cursor-pointer">
                  <img class="w-[30px] h-[30px]" alt="" src="@/assets/icon-image/excel.png" />
                  <div class="mt-[5px] text-[10px]" @click="createWord(CATEGORY.EXCEL)">表格</div>
                </div>
                <div>
                  <img
                    class="w-[30px] h-[30px] cursor-pointer"
                    alt=""
                    src="@/assets/icon-image/PPT.png"
                  />
                  <div class="mt-[5px] text-[10px]" @click="createWord(CATEGORY.PPT)">幻灯片</div>
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
        :ext-height="80"
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
