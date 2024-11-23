import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'
import BaseLayout from '@/components/layout/BaseLayout.vue'
import { TOKEN_KEY } from '@/api/request'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BaseLayout,
    redirect: '/monitor',
    children: [
      {
        path: '/monitor',
        name: 'Monitor',
        component: () => import('@/views/business/Monitor.vue'),
        meta: {
          title: '监控管理',
          icon: 'MonitorOutlined',
        },
      },
      {
        path: '/config',
        name: 'Config',
        component: () => import('@/views/business/Config.vue'),
        meta: {
          title: '配置管理',
          icon: 'SettingOutlined',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      public: true, // 标记为公开路由，不需要验证
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      public: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    document.title = `${to.meta.title || '管理系统'}`
    const isPublic = to.meta.public
    const token = localStorage.getItem(TOKEN_KEY)

    if (!isPublic && !token) {
      next('/login')
    } else {
      next()
    }
  }
)

export default router
