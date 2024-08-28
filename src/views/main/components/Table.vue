<script setup lang="ts">
import { nextTick, ref } from 'vue'
import MyTable from '@/components/table/index.vue'
import { type DataItem, HomeColumns, HomeHoverData } from '@/data/home.ts'
import { useMultiSelect, useGetOptions, useDeleteOrReName } from '@/hooks/MultiSelect.ts'
import { CloseSquareFilled, CheckSquareFilled } from '@ant-design/icons-vue'
import download from '@/util/download.ts'
import type { DeleteFileDataType } from '@/apis/types/file.ts'
import { deleteFileApi } from '@/apis/file.ts'
import { message } from 'ant-design-vue'

const props = defineProps<{
  HomeData: {
    type: []
  }
  navigationRef: {
    type: any
  }
  newItem: {
    type: any
  }
  addStatus: {
    type: Boolean
  }
}>()
const emits = defineEmits([
  'changeAddStatus',
  'changeNewItem',
  'changeHomeDataShowEdit',
  'changeHomeDataName',
  'removeHomeData',
  'reloadNewItem',
  'getAllDirectory'
])
const { HomeData, navigationRef, newItem, addStatus } = props
const { rowSelection } = useMultiSelect()
const { getPagation, pagation } = useGetOptions()

const PreviewRef = ref()
function handlePreview(record: DataItem) {
  //是目录
  if (record.folder_type === 1) {
    navigationRef.openFolder({
      filename: record.name,
      fileId: record._id
    })
    return
  }
  //返回图片
  PreviewRef.value.showPreviewImage(record)
}

const { addFolder, cancelFolder } = useDeleteOrReName(emits, pagation, newItem, HomeData)

async function moveSingle(data: any) {
  const currentId = ref([''])
  currentId.value = [data._id]
  emits('getAllDirectory', { type: 'single' })
}
async function del(index: number) {
  const param = ref<DeleteFileDataType>({
    fileId: HomeData[index]._id,
    time: new Date().toString()
  })
  const res = await deleteFileApi(param.value)
  if (res.code === 0) {
    message.success('删除成功')
    emits('removeHomeData', { index, number: 1 })
  }
}

async function share(data: any) {}

function edit(index: number) {}

// const edit = (index: number) => {
//   //重命名
//   DelOrEditName.value = DelOrEditNameEnum.EDIT_NAME
//   confirmStatus.value = CONFIRM_STATUS.RENAME_FILE
//   //点击重命名如果其他的也在这个重命名其他的先消失，这个先显示
//   if (rename.value) {
//     HomeData.value[rename.value as number].showEdit = false
//   }
//   rename.value = index
//   if (addStatus.value && HomeData.value[0].showEdit) {
//     //删除这个数据
//     HomeData.value.shift()
//     HomeData.value[0].showEdit = false
//     index = index - 1
//   }
//   HomeData.value?.forEach((item: any) => {
//     item.showEdit = false
//   })
//   newItem.value.name = ''
//   HomeData.value[index].showEdit = true
//   nextTick(() => {
//     editRef.value.focus()
//   })
// }
</script>

<template>
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
            <!--                          判断是否为图片或者音频-->
            <template v-if="record.file_type === 1 || record.file_type === 3">
              <Icon :cover="HomeData[(pagation - 1) * 15 + index].fileCover"></Icon>
            </template>
            <template v-else>
              <!--              判断是否为folder-->
              <Icon v-if="record.folder_type === 0" :file-type="record.file_type"> </Icon>
              <Icon v-if="record.folder_type === 1" :file-type="0"></Icon>
            </template>
            <div class="ml-[10px] cursor-pointer">
              {{ (record as any).name }}
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
              :fileInfo="record"
              @share1="share(record)"
              @del="del((pagation - 1) * 15 + index)"
              @edit="edit((pagation - 1) * 15 + index)"
              @move="moveSingle(record)"
              @download="download(record)"
            ></Hover>
          </div>
        </div>
      </template>
    </template>
  </MyTable>
</template>

<style scoped lang="scss"></style>
