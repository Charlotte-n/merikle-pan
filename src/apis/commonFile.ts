import type { uploadFileType } from '@/apis/types/commonFile'
import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response'

enum BASEURL {
  CREATE_FILE = '/commonFile/uploadFileContent',
  GET_FILE_LIST = '/commonFile/getFileList',
  UPDATE_FILE_CONTENT = '/commonFile/updateFileContent',
  GET_FILE_CONTENT = '/commonFile/getFileContent',
  UPDATE_FILE_NAME = '/commonFile/changeFileName',
  UPDATE_FILE_PRIVIAL = '/commonFile/updateFilePrivial',
  GET_FILE_INFO = '/commonFile/getFileInfo'
}

/**
 * 创建文件
 * @param data
 * @constructor
 */
export const CreateFileApi = (data: uploadFileType) => {
  const { userId, content, category } = data
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.CREATE_FILE,
    data: {
      userId,
      content,
      category
    }
  })
}

/**
 * 获取文档列表
 * @param userId
 * @constructor
 */
export const GetFileListApi = (userId: string) => {
  return hyRequest.get<CommonResponseType<any>>({
    url: BASEURL.GET_FILE_LIST + '/' + userId
  })
}

/**
 * 更新文件内容
 * @param data
 * @constructor
 */
export const UpdateFileContentApi = (data: { fileId: string; content: string }) => {
  const { fileId, content } = data
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.UPDATE_FILE_CONTENT,
    data: {
      id: fileId,
      content
    }
  })
}

/**
 * 获取文件内容
 * @param id
 */
export const GetFileContentApi = (id: string) => {
  return hyRequest.get<
    CommonResponseType<{
      content: string
    }>
  >({
    url: BASEURL.GET_FILE_CONTENT,
    params: {
      id
    }
  })
}

/**
 * 获取文件信息
 * @param id
 * @returns
 */
export const GetFileInfoApi = (id: string) => {
  return hyRequest.get<
    CommonResponseType<{
      title: string
      edit: boolean
      userId: string
    }>
  >({
    url: BASEURL.GET_FILE_INFO,
    params: {
      id
    }
  })
}

/**
 * 更新文件名字
 * @param body
 */
export const updateFileNameApi = (body: { name: string; id: string }) => {
  const { id, name } = body
  return hyRequest.post<
    CommonResponseType<{
      title: string
    }>
  >({
    url: BASEURL.UPDATE_FILE_NAME,
    data: {
      id,
      name
    }
  })
}

/**
 * 更新文件权限
 * @param body
 */
export const updateFilePrivial = (body: { id: string; edit: string | number }) => {
  const { id, edit } = body
  return hyRequest.post({
    url: BASEURL.UPDATE_FILE_PRIVIAL,
    data: {
      id,
      edit
    }
  })
}
