import { ref } from 'vue'

export const menu = [
  {
    path: '/main/all',
    name: '首页',
    menuCode: 'main',
    allowShow: true,
    icon: 'cloude',
    children: [
      {
        icon: 'all',
        name: '全部',
        path: '/main/all'
      },
      {
        icon: 'video',
        name: '视频',
        path: '/main/video'
      },
      {
        icon: 'music',
        name: '音频',
        path: '/main/music'
      },
      {
        icon: 'image',
        name: '图片',
        path: '/main/image'
      },
      {
        icon: 'doc',
        name: '文档',
        path: '/main/doc'
      },
      {
        icon: 'more',
        name: '其他',
        path: '/main/more'
      }
    ]
  },
  {
    name: '分享',
    menuCode: 'share',
    allowShow: true,
    icon: 'share',
    path: '/myShare',
    children: [
      {
        name: '分享目录',
        path: '/myShare'
      }
    ]
  },
  {
    name: '回收站',
    menuCode: 'cycle',
    allowShow: true,
    icon: 'del',
    path: '/cycle',
    tips: '回收站为你保存10天内删除的文件',
    children: [
      {
        name: '删除的文件',
        path: '/cycle'
      }
    ]
  },
  {
    name: '设置',
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
      },
      {
        name: '文件列表',
        path: '/settings/fileList'
      }
    ]
  },
  {
    name: '多人协作',
    menuCode: 'cooperation',
    allowShow: true,
    icon: 'doc',
    path: '/commonFile/our',
    children: [
      {
        name: '我的文档',
        path: '/commonFile/our'
      }
    ]
  }
]

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

export const HomeColumns = [
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '删除时间',
    dataIndex: 'time',
    key: 'time',
    width: '15%'
  },
  {
    title: '大小',
    dataIndex: 'size',
    width: '15%',
    key: 'size'
  }
]

export const HomeData = ref<DataItem[]>([
  {
    key: 1,
    name: 'John Brown sr.',
    time: 60,
    size: 'New York No. 1 Lake Park',
    showEdit: false
  },
  {
    key: 2,
    name: 'Joe Black',
    time: 32,
    size: 'Sidney No. 1 Lake Park',
    showEdit: false
  }
])
export const HomeHoverData = ref([
  {
    key: 0,
    icon: 'share1',
    text: '分享',
    show: true
  },
  {
    key: 1,
    icon: 'del',
    text: '删除',
    show: true
  },
  {
    key: 2,
    icon: 'edit',
    text: '重命名',
    show: true
  },
  {
    key: 4,
    icon: 'move',
    text: '移动',
    show: true
  },
  {
    key: 5,
    icon: 'download',
    text: '下载',
    show: false
  }
])
