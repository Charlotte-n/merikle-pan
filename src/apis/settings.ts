import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response'
import type { AllUserInfo, SingleUserInfo } from '@/apis/types/settings'

enum BASEURL {
  GET_USER_LIST = '/admin/findAllUser',
  SEARCH_USER = '/admin/searchUser',
  DELETE_USER = '/admin/deleteUser',
  CHANGE_USER_SPACE = '/admin/changeUserSpace',
  INITIAL_SPACE = '/initial-space/updateInitialSpace'
}

/**
 * 获取所有用户的信息
 */
export const getAllUserListApi = () => {
  return hyRequest.get<CommonResponseType<AllUserInfo>>({
    url: BASEURL.GET_USER_LIST
  })
}

/**
 * 模糊查询用户
 * @param nickName
 * @constructor
 */
export const SearchUserApi = (nickName: string) => {
  return hyRequest.post<CommonResponseType<AllUserInfo>>({
    url: BASEURL.SEARCH_USER,
    data: {
      nickName
    }
  })
}

/**
 * 删除用户
 * @param id
 */
export const deleteUserApi = (id: string) => {
  return hyRequest.post({
    url: BASEURL.DELETE_USER,
    data: {
      id
    }
  })
}

/**
 * 更新用户总共的空间
 * @param id
 * @param space
 */
export const changeUserTotalSpace = (id: string, space: number) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.CHANGE_USER_SPACE,
    data: {
      id,
      space
    }
  })
}

/**
 * 初始化空间
 * @param space
 */
export const initialSpaceApi = (space: number) => {
  return hyRequest.post({
    url: BASEURL.INITIAL_SPACE,
    data: {
      space
    }
  })
}
