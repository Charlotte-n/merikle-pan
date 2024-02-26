import { defineStore } from 'pinia'

export const useUserInfo = defineStore('userInfoStore', {
  state: () => ({
    userInfo: {},
    token: ''
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
    }
  },
  persist: {
    paths: ['userInfo', 'token']
  }
})
