import { Ref, ref } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { DataItem } from '@/data/home.ts'
import type { AddFolderDataType, RenameFileDataType } from '@/apis/types/file.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
import { useRoute } from 'vue-router'
import { CONFIRM_STATUS, DelOrEditNameEnum } from '@/views/main/types'
import { addFolderApi, RenameFileApi } from '@/apis/file.ts'
import { message } from 'ant-design-vue'

function useMultiSelect() {
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
  return {
    rowSelection
  }
}

function useGetOptions() {
  const pagation = ref(1)
  const getPagation = (index: number) => {
    pagation.value = index
  }
  return {
    getPagation,
    pagation
  }
}

function useGetParams(newItem: any) {
  const UserStore = useUserInfo()
  const route = useRoute()
  const path = ref((route.query as { path: string }).path)
  const param: AddFolderDataType = {
    fileId: '',
    filePid: path.value
      ? path.value.indexOf('/')
        ? path.value.split('/')[path.value.split('/').length - 1]
          ? path.value.split('/')[path.value.split('/').length - 1]
          : 0
        : path.value
      : 0,
    name: newItem.name,
    user_id: UserStore.userInfo._id
  }
  return param
}

function useDeleteOrReName(emits: any, pagation: Ref<number>, newItem: any, HomeData: any) {
  //定义是删除新建的文件夹还是重命名
  const DelOrEditName = ref(DelOrEditNameEnum.REST)
  const confirmStatus = ref(CONFIRM_STATUS.RESET)
  function reset() {
    DelOrEditName.value = DelOrEditNameEnum.REST
    confirmStatus.value = CONFIRM_STATUS.RESET
    emits('changeAddStatus', { addStatus: false })
  }
  const cancelFolder = (index: number) => {
    emits('changeNewItem', { name: '' })
    if ((DelOrEditName.value as any) === DelOrEditNameEnum.EDIT_NAME) {
      emits('changeHomeDataShowEdit', { index, showEdit: false })
    } else if ((DelOrEditName.value as any) === DelOrEditNameEnum.DEL) {
      emits('removeHomeData', { index: (pagation.value - 1) * 15, number: 1 })
    }
    reset()
  }

  const RenameFile = async (index: number) => {
    const param = ref<RenameFileDataType>({
      filename: newItem.name,
      _id: HomeData[index]._id
    })
    const res = await RenameFileApi(param.value)
    if (res.code === 0) {
      message.success('重命名成功')
      //然后显示重命名的内容
      emits('changeHomeDataShowEdit', { index, showEdit: false })
      HomeData[index].name = newItem.value.name
      emits('changeHomeDataName', { index, name: newItem.name })
    } else {
      message.error(res.message)
    }
  }
  const addFolder = async (addIndex: number, index: number) => {
    //判断是重命名还是添加文件夹
    if ((confirmStatus.value as any) === CONFIRM_STATUS.ADD_FOLDER) {
      if (newItem.name.indexOf('/') !== -1) {
        message.error('不能含有/等特殊字符')
        return
      }
      const res = await addFolderApi(useGetParams(newItem))
      if (res.code === 0) {
        message.success('创建成功')
        //显示这个文件
        emits('changeHomeDataShowEdit', { index: addIndex, showEdit: false })
        emits('changeAddStatus', { addStatus: false })
        emits('reloadNewItem')
      } else {
        message.error(res.message)
      }
    } else if ((confirmStatus.value as any) === CONFIRM_STATUS.RENAME_FILE) {
      await RenameFile(addIndex + index)
    }
    reset()
  }
  return {
    addFolder,
    cancelFolder
  }
}

export { useMultiSelect, useGetOptions, useGetParams, useDeleteOrReName }
