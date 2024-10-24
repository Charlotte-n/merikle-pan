import hyRequest from '@/services'
import type {
  AddFolderDataType,
  DeleteFileDataType,
  GetAllParam,
  MergeParam,
  RenameFileDataType,
  UploadChunkParam,
  VerifyStatusParam
} from '@/apis/types/file'
import type { SingleFileStatus } from '@/data/types/file'
import type { CommonResponseType } from '@/apis/types/Response'

enum BASEURL {
  UPLOAD_FILE = '/file/upload/chunk',
  VERIFY_STATUS = '/file/upload/isExit',
  MERGE = '/file/merge',
  GET_ALL = '/file/list',
  ADD_FOLDER = '/file/addNewFolder',
  RENAME_FILE = '/file/rename',
  FILE_IMAGE = '/file/image',
  DELETE_FILE = '/file/deleteFolder',
  MULTIPLE_DELETE = '/file/multipleDelete',
  GET_FILE_INFO = '/file/fileInfo'
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
  const { chunkIndex, fileHash, filename, file_type } = queryParam
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
      filename,
      file_type
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
      currentFile.uploadSize = index * chunkSize + loaded
      currentFile.uploadProgress = Math.floor((currentFile.uploadSize / fileSize) * 100)
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
  const { fileHash, filename, totalCount, file_type, filePid } = value
  return hyRequest.get({
    url: BASEURL.VERIFY_STATUS,
    params: {
      fileSize: value.fileSize,
      user_id: value.user_id,
      fileHash,
      filename,
      totalCount,
      file_type,
      filePid
    }
  })
}

/**
 * 合并文件
 * @param param
 * @constructor
 */

export const MergeApi = (param: MergeParam) => {
  const { fileHash, filename, fileSize, user_id, file_type, filePid } = param
  return hyRequest.post({
    url: BASEURL.MERGE,
    data: {
      fileHash,
      filename,
      fileSize,
      user_id,
      file_type,
      filePid
    }
  })
}

export const getAllFileApi = (param: GetAllParam) => {
  const { page, pageSize, fileType, fileId, title } = param
  return hyRequest.get<CommonResponseType<any>>({
    url: BASEURL.GET_ALL,
    params: {
      page,
      pageSize,
      fileType,
      fileId,
      title
    }
  })
}

/**
 * 新建文件夹
 * @param data
 */
export const addFolderApi = (data: AddFolderDataType) => {
  return hyRequest.post({
    url: BASEURL.ADD_FOLDER,
    data
  })
}

/**
 * 重命名文件
 * @param data
 * @constructor
 */

export const RenameFileApi = (data: RenameFileDataType) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.RENAME_FILE,
    data
  })
}

/**
 * 获取文件的图片
 * @param _id
 */
export const getFileImageApi = (_id: string) => {
  return hyRequest.get<CommonResponseType<any>>({
    url: BASEURL.FILE_IMAGE,
    params: {
      _id
    }
  })
}

/**
 * 删除文件
 * @param data
 */
export const deleteFileApi = (data: DeleteFileDataType) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.DELETE_FILE,
    data
  })
}

/**
 * 批量删除
 * @param ids
 * @param time
 */
export const multipleDeleteApi = (ids: string[], time: string) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.MULTIPLE_DELETE,
    data: {
      ids,
      time
    }
  })
}

/**
 * 获取文件信息
 * @param id
 */
export const getFileInfoApi = (id: string) => {
  return hyRequest.get({
    url: BASEURL.GET_FILE_INFO,
    params: {
      id
    }
  })
}
