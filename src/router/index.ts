import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '@/views/login-register/index.vue'
import { useUserInfo } from '@/stores/userInfo.ts'
import Message from '@/components/message'
import { markRaw } from 'vue'

const CommonFile = () => import('@/views/ShareFile/index.vue')
const FramWork = () => import('@/views/FramWork.vue')
//main
const Main = () => import('@/views/main/index.vue')
//share
const Share = () => import('@/views/share/index.vue')
const Cycle = () => import('@/views/cycle/index.vue')
const sysSetting = () => import('@/views/setting/sysSetting/index.vue')
const fileList = () => import('@/views/setting/fileList/index.vue')
const userList = () => import('@/views/setting/userList/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginRegister,
      meta: {
        allowShow: true,
        needLogin: true,
        menuCode: 'main'
      }
    },
    {
      path: '/',
      name: 'FarmWork',
      //先找到通用的之后进行划分路由
      component: FramWork,
      children: [
        {
          path: '/',
          redirect: '/main/all'
        },
        //因为这里有许多可以复用的，所以可以这样写
        {
          path: '/main/:category',
          meta: {
            allowShow: true,
            needLogin: true,
            menuCode: 'main'
          },
          component: markRaw(Main)
        },
        {
          path: '/myShare',
          name: 'share',
          component: Share,
          meta: {
            allowShow: true,
            menuCode: 'share',
            needLogin: true
          }
        },
        {
          path: '/cycle',
          name: 'cycle',
          meta: {
            allowShow: true,
            needLogin: true,
            menuCode: 'cycle'
          },
          component: Cycle
        },
        {
          path: '/settings/sysSetting',
          name: '系统设置',
          component: sysSetting,
          meta: {
            allowShow: false,
            needLogin: true,
            menuCode: 'setting'
          }
        },
        {
          path: '/settings/userList',
          name: '用户管理',
          component: userList,
          meta: {
            allowShow: false,
            needLogin: true,
            menuCode: 'setting'
          }
        },
        {
          path: '/commonFile/our',
          name: '多人协作',
          component: CommonFile,
          meta: {
            allowShow: true,
            needLogin: true,
            menuCode: 'cooperation'
          }
        }
      ]
    },
    {
      path: '/shareCheck/:shareId',
      name: 'outShareCheck',
      component: () => import('@/views/out-share/c-pages/check-share/CheckShare.vue')
    },
    {
      path: '/share/:shareId',
      name: 'shareId',
      component: () => import('@/views/out-share/c-pages/share/OutShare.vue')
    },
    {
      path: '/commonWord/:id',
      name: 'commonWord',
      component: () => import('@/views/ShareFile/c-pages/common-word/index.vue')
    },
    {
      path: '/commonExcel/:id',
      name: 'commonExcel',
      component: () => import('@/views/ShareFile/c-pages/common-excel/index.vue')
    }
  ]
})
//进行路有拦截
//设置路由白名单
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  const token = useUserInfo().token
  if (whiteList.includes(to.path)) {
    next()
  } else {
    //查看是否有token
    if (token) {
      try {
        next()
      } catch (e) {
        //token过期了，返回登录页面
        console.log(e)
        Message.warn('登录过期,请重新登录')
        next('/login')
      }
    } else {
      next('/login')
    }
  }
})

export default router
