import type { SingleFileStatus } from '@/data/types/file.ts'

export interface UploadChunkParam {
  chunkIndex: number
  fileHash: string
  filename: string
  file_type: number
}

export interface UploadChunkOtherParam {
  currentFile: SingleFileStatus
  filesize: number
  index: number
  chunkSize: number
}

export interface VerifyStatusParam {
  fileSize: number
  user_id: string
  fileHash: string
  totalCount: number
  filename: string
  file_type: string
  filePid: string | number
}

export interface MergeParam {
  fileHash: string
  filename: string
  fileSize: number
  user_id: string
  file_type: number
  filePid: string | number
}

export interface GetAllParam {
  page: number
  pageSize: number
  fileType?: number | null
  fileId?: string | null
  title?: string | null
}

export interface AddFolderDataType {
  name: string
  fileId: string
  filePid: number | string
  user_id?: string
}

/**
 * 重命名文件
 */

export interface RenameFileDataType {
  filename: string
  _id: string
}

export interface DeleteFileDataType {
  fileId: string
  user_id?: string
}
