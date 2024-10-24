import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response'
import type { GetAllDirectoryData, MoveFileBody } from '@/apis/types/directory'

enum BASEURL {
  GET_ALL_DIRECTORY = '/directory/allDirectory',
  MOVE_DIRECTORY = '/directory/move',
  GET_NAVIGATION = '/directory/getNavigation',
  GET_SUBCATEGORY = '/directory/subDirectory'
}

/**
 * 获取所有目录
 * @param userId
 * @param filePid
 */
export const getAllDirectoryApi = (filePid: string[] | number) => {
  return hyRequest.post<CommonResponseType<GetAllDirectoryData>>({
    url: BASEURL.GET_ALL_DIRECTORY,
    data: {
      filePid
    }
  })
}

/**
 * 移动文件或者目录
 * @param data
 * @constructor
 */
export const MoveFileOrDirectoryApi = (data: MoveFileBody) => {
  return hyRequest.patch<CommonResponseType<any>>({
    url: BASEURL.MOVE_DIRECTORY,
    data
  })
}

/**
 * 获取目录导航的地址
 * @param path
 */
export const getNavigationApi = (path: string) => {
  return hyRequest.get<CommonResponseType<{ path: string }>>({
    url: BASEURL.GET_NAVIGATION + '?path=' + path
  })
}

/**
 * 获取目录下的子目录
 * @param fileId
 * @param ids
 */
export const getSubCategoryApi = (fileId: string, ids: string[]) => {
  return hyRequest.get<CommonResponseType<any>>({
    url: BASEURL.GET_SUBCATEGORY,
    params: {
      fileId,
      ids
    }
  })
}
