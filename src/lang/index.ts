import { createI18n } from 'vue-i18n'
import en from './langs/en.ts'
import zh from './langs/zh.ts'

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN', locale: 'zh' },
  { label: 'English', value: 'en-US', locale: 'en' }
]
const defaultLocale =
  (localStorage.getItem('currentLang') as string) == '0' ? 'zh-CN' : 'en' || 'zh-CN'

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  legacy: false,
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': zh
  }
})

export default i18n
