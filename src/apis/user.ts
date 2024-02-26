import hyRequest from '@/services'

enum BASEURL {
  changeAvatar = '/user/upload/avatar',
  GET_USER_INFO = '/user/info'
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
