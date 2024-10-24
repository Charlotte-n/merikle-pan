import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response'
import type { RecycleListDataType } from '@/apis/types/recycle'

enum BASEURL {
  RECYCLE_LIST = '/recycle/list',
  COMPLETE_DELETE = '/recycle/delete',
  REVERT_FILE = '/recycle/revert'
}

/**
 * 回收站列表
 * @param userId
 */
export const getRecycleListApi = (userId: string) => {
  return hyRequest.get<CommonResponseType<RecycleListDataType>>({
    url: BASEURL.RECYCLE_LIST,
    params: {
      userId
    }
  })
}

/**
 * 文件的彻底删除
 * @param ids
 */
export const completeDeleteApi = (ids: string[]) => {
  return hyRequest.post<CommonResponseType<RecycleListDataType>>({
    url: BASEURL.COMPLETE_DELETE,
    data: {
      ids
    }
  })
}

/**
 * 还原文件
 * @param ids
 */
export const revertFileApi = (ids: string[]) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.REVERT_FILE,
    data: {
      ids
    }
  })
}
