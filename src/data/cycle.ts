import { computed } from 'vue'
import i18n from '@/lang'
const $t = i18n.global.t

export const CycleColumn = computed(() => [
  {
    title: $t('cycle.table.title.fileName'),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: $t('cycle.table.title.delete'),
    dataIndex: 'time',
    key: 'time',
    width: '12%'
  },
  {
    title: $t('cycle.table.title.size'),
    dataIndex: 'size',
    width: '20%',
    key: 'size'
  }
])
export const CycleHoverData = [
  {
    key: 0,
    icon: 'revert',
    text: $t('cycle.reduction')
  },
  {
    key: 1,
    icon: 'del',
    text: $t('cycle.delete')
  }
]
