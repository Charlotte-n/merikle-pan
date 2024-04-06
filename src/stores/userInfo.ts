import { defineStore } from 'pinia'

export const useUserInfo = defineStore('userInfoStore', {
  state: () => ({
    userInfo: {} as { _id: string },
    token: '',
    space: {} as { useSpace: string; totalSpace: string }
  }),
  actions: {
    updateToken(value: string) {
      this.token = value
    },
    updateUserInfo(value: any) {
      this.userInfo = value
    },
    //退出登录
    logOut() {
      this.token = ''
    },
    changeUserSpace(value: { useSpace: string; totalSpace: string }) {
      this.space = value
    }
  },
  persist: {
    paths: ['userInfo', 'token', 'space']
  }
})
