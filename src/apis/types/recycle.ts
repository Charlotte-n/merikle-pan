export type RecycleListDataType = RecycleSingleType[]
export interface RecycleSingleType {
  id: string
  deleteTime: string
  size: string
  name: string
  path: string
  fileType: number | string
  folderType: string | number
}
