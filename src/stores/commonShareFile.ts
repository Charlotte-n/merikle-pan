import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonShareFileStore = defineStore('CommonShareFileStore', () => {
  const innerHtmlContent = ref<any>()
  const changeInnerHtmlContent = (value: any) => {
    innerHtmlContent.value = value
  }
  return {
    innerHtmlContent,
    changeInnerHtmlContent
  }
})
