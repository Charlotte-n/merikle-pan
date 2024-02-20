import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfo = defineStore('userInfo', () => {
  const userInfo = ref({})

  return {
    userInfo
  }
})
