import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style/base.scss'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'quill/dist/quill.core.css' // 引入样式
import 'quill/dist/quill.snow.css' // snow theme
import 'quill/dist/quill.bubble.css' // bubble theme
import 'ant-design-vue/dist/reset.css'
import 'normalize.css'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/demo.css'
import Modal from './components/ant-modal/ant-modal.vue'
import Avatar from '@/components/avatar/index.vue'
import Table from '@/components/table/index.vue'
import Hover from '@/components/hover/index.vue'
import pinia from '@/stores/index.ts'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Navigation from '@/components/navigation/index.vue'

import i18n from '@/lang'
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.component('Modal', Modal)
app.component('Avatar', Avatar)
app.component('MyTable', Table)
app.component('Hover', Hover)
app.component('Navigation', Navigation)
app.config.globalProperties.globalInfo = {
  imageUrl: 'http://localhost:3000/static/'
}

app.use(pinia)
app.use(Antd)
app.use(i18n)
app.use(router)

app.mount('#app')
