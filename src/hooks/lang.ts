import { ref } from 'vue'
import { useStorage } from '@/hooks/useStorage.ts'
import { LOCALE_OPTIONS } from '@/lang'

export const useLang = (locale: { value: string }) => {
  const { setItem, getItem } = useStorage()
  const currentLang = ref(Number(getItem('currentLang')) ? Number(getItem('currentLang')) : 0)
  const changeLang = (lang: number) => {
    currentLang.value = lang
    if (lang === 0) {
      locale.value = 'zh-CN'
    } else {
      locale.value = 'en'
    }

    if (Number(getItem('currentLang')) === currentLang.value) {
      return
    } else {
      setItem('currentLang', JSON.stringify(lang))
    }
  }

  return {
    changeLang,
    currentLang
  }
}
