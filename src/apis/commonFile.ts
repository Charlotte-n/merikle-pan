import type { uploadFileType } from '@/apis/types/commonFile.ts'
import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response.ts'

enum BASEURL {
  CREATE_FILE = '/commonFile/uploadContent',
  GET_FILE_LIST = '/commonFile/getFileList',
  UPDATE_FILE_CONTENT = '/commonFile/updateFileContent',
  GET_FILE_CONTENT = '/commonFile/getFileContent'
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
export const UpdateFileContent = (data: { id: string; content: string }) => {
  const { id, content } = data
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.UPDATE_FILE_CONTENT,
    data: {
      id,
      content
    }
  })
}

/**
 * 获取文件内容
 * @param id
 */
export const getFileContent = (id: string) => {
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
