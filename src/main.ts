import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style/base.scss'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
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
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.component('Modal', Modal)
app.component('Avatar', Avatar)
app.component('MyTable', Table)
app.component('Hover', Hover)
app.config.globalProperties.globalInfo = {
  imageUrl: 'http://localhost:3000/static/'
}

app.use(pinia)
app.use(Antd)
app.use(router)

app.mount('#app')
