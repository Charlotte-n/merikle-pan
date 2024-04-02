export interface ShareLinkParam {
  userId: string
  fileId: string
  validTime: number
  code: string
}

export type ShareLinkData = ShareSingleLinkData[]
export interface ShareSingleLinkData {
  id: string
  code: string
  validTime: string
  folderType: number
  fileType: number
  createTime: string
  viewCount: number
  fileName: string
  filePath: string
}
