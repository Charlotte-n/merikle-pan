import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('commonStore', () => {
  const popoverShow = ref(false)
  const spinning = ref(false)

  const changePopoverShow = () => {
    popoverShow.value = !popoverShow.value
  }
  const closePopoverShow = () => {
    popoverShow.value = false
  }
  //上传文件改变这个
  const uploadChangePopoverShow = () => {
    popoverShow.value = true
  }

  //改变spinning
  const closeSpinning = () => {
    spinning.value = false
  }
  const openSpinning = () => {
    spinning.value = true
  }
  return {
    popoverShow,
    spinning,
    changePopoverShow,
    closePopoverShow,
    uploadChangePopoverShow,
    closeSpinning,
    openSpinning
  }
})
