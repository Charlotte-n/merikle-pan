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
}

export interface MergeParam {
  fileHash: string
  filename: string
  fileSize: number
  user_id: string
  file_type: number
}

export interface GetAllParam {
  page: number
  pageSize: number
}

export interface AddFolderDataType {
  name: string
  fileId: string
  filePid: number
  user_id: string
}