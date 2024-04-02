import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response.ts'
import type { ShareLinkData, ShareLinkParam } from '@/apis/types/share.ts'

enum BASEURL {
  CREATE_SHARE_LINK = '/share/link',
  SHARE_LIST = '/share/list',
  CANCEL_LIST = '/share/cancel'
}

/**
 * 创建分享链接
 * @param data
 */
export const createShareLinkApi = (data: ShareLinkParam) => {
  return hyRequest.post<
    CommonResponseType<{
      id: string
      code: string
    }>
  >({
    url: BASEURL.CREATE_SHARE_LINK,
    data
  })
}

/**
 * 获取分享列表
 * @param userId
 */
export const getShareFileListApi = (userId: string) => {
  return hyRequest.get<CommonResponseType<ShareLinkData>>({
    url: BASEURL.SHARE_LIST,
    params: {
      userId
    }
  })
}

/**
 * 取消收藏
 * @param ids
 */
export const cancelShareFileApi = (ids: string[]) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.CANCEL_LIST,
    data: {
      ids
    }
  })
}
