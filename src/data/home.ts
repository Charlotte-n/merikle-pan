import { computed, ref } from 'vue'
import i18n from '@/lang'
const $t = i18n.global.t
export const menu = computed(() => [
  {
    path: '/main/all',
    name: $t('navbar.index'),
    menuCode: 'main',
    allowShow: true,
    icon: 'cloude',
    children: [
      {
        icon: 'all',
        name: $t('navbar.index.all'),
        path: '/main/all'
      },
      {
        icon: 'video',
        name: $t('navbar.index.video'),
        path: '/main/video'
      },
      {
        icon: 'music',
        name: $t('navbar.index.audio'),
        path: '/main/music'
      },
      {
        icon: 'image',
        name: $t('navbar.index.img'),
        path: '/main/image'
      },
      {
        icon: 'doc',
        name: $t('navbar.index.doc'),
        path: '/main/doc'
      },
      {
        icon: 'more',
        name: $t('navbar.index.other'),
        path: '/main/more'
      }
    ]
  },
  {
    name: $t('navbar.share'),
    menuCode: 'share',
    allowShow: true,
    icon: 'share',
    path: '/myShare',
    children: [
      {
        name: $t('navbar.share.menu'),
        path: '/myShare'
      }
    ]
  },
  {
    name: $t('navbar.cycle'),
    menuCode: 'cycle',
    allowShow: true,
    icon: 'del',
    path: '/cycle',
    tips: $t('navbar.cycle.tips'),
    children: [
      {
        name: $t('navbar.cycle.menu'),
        path: '/cycle'
      }
    ]
  },
  {
    name: $t('navbar.setting'),
    menuCode: 'setting',
    allowShow: false,
    icon: 'settings',
    path: '/settings/sysSetting',
    children: [
      {
        name: '系统设置',
        path: '/settings/sysSetting'
      },
      {
        name: '用户列表',
        path: '/settings/userList'
      }
      // {
      //   name: '文件列表',
      //   path: '/settings/fileList'
      // }
    ]
  },
  {
    name: $t('navbar.common'),
    menuCode: 'cooperation',
    allowShow: true,
    icon: 'doc',
    path: '/commonFile/our',
    children: [
      {
        name: $t('navbar.common.doc'),
        path: '/commonFile/our'
      }
    ]
  }
])

export interface HoverSingleData {
  icon: string
  key: number
  text: string
}
export type HoverData = HoverSingleData[]

//首页Table数据
export interface DataItem {
  key: number
  name: string
  time: number | string
  size: string
  showEdit: boolean
  children?: DataItem[]
}

export const HomeColumns = computed(() => [
  {
    title: $t('table.title.fileName'),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: $t('table.title.deleteTime'),
    dataIndex: 'time',
    key: 'time',
    width: '15%'
  },
  {
    title: $t('table.title.size'),
    dataIndex: 'size',
    width: '15%',
    key: 'size'
  }
])
export const HomeHoverData = computed(() => [
  {
    key: 0,
    icon: 'share1',
    text: $t('table.hover.share'),
    show: true
  },
  {
    key: 1,
    icon: 'del',
    text: $t('table.hover.delete'),
    show: true
  },
  {
    key: 2,
    icon: 'edit',
    text: $t('table.hover.rename'),
    show: true
  },
  {
    key: 4,
    icon: 'move',
    text: $t('table.hover.move'),
    show: true
  },
  {
    key: 5,
    icon: 'download',
    text: $t('table.hover.download'),
    show: false
  }
])
