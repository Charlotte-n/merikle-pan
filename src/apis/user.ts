import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response.ts'

enum BASEURL {
  changeAvatar = '/user/upload/avatar',
  GET_USER_INFO = '/user/info',
  GET_USER_SPACE = '/user/space'
}

/**
 * 获取用户信息
 * @param userId
 * @constructor
 */
export const GetUserInfo = (userId: string) => {
  return hyRequest.get({
    url: BASEURL.GET_USER_INFO,
    params: {
      userId
    }
  })
}

/**
 * 修改头像
 * @param user_id
 * @param data
 */
export const changeAvatarApi = (user_id: any, data: any) => {
  return hyRequest.patch({
    url: BASEURL.changeAvatar + '?userId=' + user_id,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取用户使用的空间
 * @param userId
 * @param type
 * @param fileSize
 */
export const getUserSpaceApi = (userId: string, type?: number, fileSize?: number[]) => {
  return hyRequest.get<CommonResponseType<{ useSpace: string; totalSpace: string }>>({
    url: BASEURL.GET_USER_SPACE,
    params: {
      userId,
      fileSize,
      type
    }
  })
}
