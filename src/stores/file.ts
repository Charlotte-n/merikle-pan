import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore(
  'fileStore',
  () => {
    const filePid = ref<string | number>(0)

    const changeFilePid = (value: string | number) => {
      filePid.value = value
    }

    return {
      filePid,
      changeFilePid
    }
  },
  {
    persist: true
  }
)
