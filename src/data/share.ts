import { computed } from 'vue'
import i18n from '@/lang'

const $t = i18n.global.t
export const shareColume = computed(() => [
  {
    title: $t('share.table.title.fileName'),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: $t('share.table.title.time'),
    dataIndex: 'time',
    key: 'time',
    width: '12%'
  },
  {
    title: $t('share.table.title.expiration'),
    dataIndex: 'unValid',
    width: '20%',
    key: 'unValid'
  },
  {
    title: $t('share.table.title.scan'),
    dataIndex: 'number',
    width: '20%',
    key: 'number'
  }
])
export const ShareHoverData = [
  {
    key: 0,
    icon: 'link',
    text: '复制链接'
  },
  {
    key: 1,
    icon: 'cancel',
    text: '取消分享'
  }
]
