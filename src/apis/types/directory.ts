//data代表返回来的data

export type GetAllDirectoryData = GetSingleDirectoryData[]

export interface GetSingleDirectoryData {
  _id: string
  file_id: string
  file_pid: string
  file_name: string
  create_time: string
  folder_type: number
  del_flag: number
  user: string
}

//移动文件的请求数据
export interface MoveFileBody {
  fileId: string[]
  folderId: string
}
