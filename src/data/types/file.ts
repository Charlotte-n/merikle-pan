//file的type
export interface SingleFileStatus {
  file: any
  //文件id
  uid: any
  //md5进度
  md5: any
  //md5进度
  md5Progress: number
  //文件名
  filename: any
  //文件状态
  status: string
  //已上传文件的大小
  uploadSize: number
  //总文件的大小
  totalFileSize: number
  //暂停
  pause: boolean
  //当前分片
  chunkIndex: number
  //文件父级id
  filePid: string | number
  //错误信息
  errorMsg: any
  uploadProgress: number
}
