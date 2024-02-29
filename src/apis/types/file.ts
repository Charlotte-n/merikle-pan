import type { SingleFileStatus } from '@/data/types/file.ts'

export interface UploadChunkParam {
  chunkIndex: number
  fileHash: string
  filename: string
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
}
