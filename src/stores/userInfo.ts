import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfo = defineStore('userInfo', () => {
  const userInfo = ref({})
  const token = ref<string>()

  const updateToken = (value: string) => {
    token.value = 'Beare ' + value
  }

  return {
    userInfo,
    token,
    updateToken
  }
})
