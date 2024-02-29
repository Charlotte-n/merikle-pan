import hyRequest from '@/services'
import type {
  MergeParam,
  UploadChunkOtherParam,
  UploadChunkParam,
  VerifyStatusParam
} from '@/apis/types/file.ts'
import type { SingleFileStatus } from '@/data/types/file.ts'

enum BASEURL {
  UPLOAD_FILE = '/file/upload/chunk',
  VERIFY_STATUS = '/file/upload/isExit',
  MERGE = '/file/merge'
}

/**
 * 上传切片
 * @param data
 * @param queryParam
 * @param otherParam
 * @constructor
 */
export const UploadChunkApi = (
  data: any,
  queryParam: UploadChunkParam,
  otherParam: { chunkSize: number; fileSize: number; index: number; currentFile: SingleFileStatus }
) => {
  const { chunkIndex, fileHash, filename } = queryParam
  const { currentFile, fileSize, index, chunkSize } = otherParam
  return hyRequest.post({
    url: BASEURL.UPLOAD_FILE,
    showLoading: false,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      chunkIndex,
      fileHash,
      filename
    },
    onUploadProgress(progressEvent) {
      let loaded = progressEvent.loaded
      if (loaded > fileSize) {
        loaded = fileSize
        //上传成功
        if (currentFile.uploadProgress === 100) {
          currentFile.status = 'upload_finish'
        }
      }
      console.log(currentFile, '上传我的值为')
      currentFile.uploadSize = index * chunkSize + loaded
      currentFile.uploadProgress = Math.floor((currentFile.uploadSize / fileSize) * 100)
      //上传成功
      if (currentFile.uploadProgress === 100) {
        currentFile.status = 'upload_finish'
      }
    }
  })
}

/**
 * 判断文件状态
 * @param value
 * @constructor
 */
export const VerifyStatusApi = (value: VerifyStatusParam) => {
  const { fileHash, filename, totalCount } = value
  return hyRequest.get({
    url: BASEURL.VERIFY_STATUS,
    params: {
      fileSize: value.fileSize,
      user_id: value.user_id,
      fileHash,
      filename,
      totalCount
    }
  })
}

/**
 * 合并文件
 * @param param
 * @constructor
 */

export const MergeApi = (param: MergeParam) => {
  const { fileHash, filename } = param
  return hyRequest.get({
    url: BASEURL.MERGE,
    params: {
      fileHash,
      filename
    }
  })
}
