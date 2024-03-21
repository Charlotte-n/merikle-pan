import { ref } from 'vue'
import type { SingleFileStatus } from './types/file.ts'

export const STATUS: any = {
  emptyfile: {
    value: 'emptyfile',
    desc: '文件夹为空',
    color: '#F750000',
    icon: 'close'
  },
  fail: {
    value: 'file',
    desc: '上传失败',
    color: '#F750000',
    icon: 'close'
  },
  init: {
    value: 'init',
    desc: '解析中',
    color: '#e6a23c',
    icon: 'clock'
  },
  uploading: {
    value: 'uploading',
    desc: '上传中',
    color: '#409eff',
    icon: 'upload'
  },
  upload_finish: {
    value: 'upload_finish',
    desc: '上传完成',
    color: '#67c23a',
    icon: 'ok'
  },
  upload_seconds: {
    value: 'upload_seconds',
    desc: '秒传',
    color: '#67c23a',
    icon: 'ok'
  }
}
//文件列表
export const fileList = ref<SingleFileStatus[]>([
  // {
  //   file: '1234',
  //   //文件id
  //   uid: '123',
  //   //md5进度
  //   md5: null,
  //   //md5进度
  //   md5Progress: 0,
  //   //文件名
  //   filename: new Date() + '.jpeg',
  //   //文件状态
  //   status: STATUS.uploading.value,
  //   //已上传文件的大小
  //   uploadSize: 0,
  //   //总文件的大小
  //   totalFileSize: 0,
  //   //暂停
  //   pause: false,
  //   //当前分片
  //   chunkIndex: 0,
  //   //文件父级id
  //   filePid: '12345',
  //   //错误信息
  //   errorMsg: null,
  //   uploadProgress: 0
  // }
])

// 文件的类型

//控制上传的类型
export const controlFileType = {
  all: {
    accept: '*'
  },
  video: {
    accept: '.mp4,.avi,.mkv,.mov'
  },
  music: {
    accept: '.mp3,.wav,.wma,.mp2,.flac,.midi,.ra,.aac,.cda'
  },
  image: {
    accept: '.jpeg,.jpg,.png,.gif,.bmp,.psd,.pdt,.dds,.psd,.webp,.xmp,.svg,.tiff'
  },
  doc: {
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt'
  },
  others: {
    accept: '*'
  }
}
