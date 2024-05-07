import { computed } from 'vue'
import i18n from '@/lang'

const $t = i18n.global.t

export const CommonFileColumnType = computed(() => [
  {
    title: $t('commonFile.table.fileName'),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: $t('commonFile.table.owner'),
    dataIndex: 'owner',
    key: 'owner'
  },
  {
    title: $t('commonFile.table.edit'),
    dataIndex: 'edit',
    key: 'edit'
  }
])
export const CommonFileShareData = [
  {
    key: 0,
    title: '可查看',
    default: 'active'
  },
  {
    key: 1,
    title: '可编辑'
  }
]

export enum CATEGORY {
  PDF = 1,
  EXCEL = 2
}
