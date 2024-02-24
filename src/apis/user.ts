import hyRequest from '@/services'

enum BASEURL {
  changeAvatar = '/user/upload/avatar'
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
