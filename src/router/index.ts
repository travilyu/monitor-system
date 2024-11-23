import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import BaseLayout from '@/components/layout/BaseLayout.vue'
import { TOKEN_KEY } from '@/api/request'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BaseLayout,
    redirect: '/line/monitor',
    children: [
      {
        path: '/line/monitor',
        name: 'LineMonitor',
        component: () => import('@/views/business/line/Monitor.vue'),
        meta: {
          title: '线路监控',
          icon: 'MonitorOutlined',
          requiresAuth: true,
        },
      },
      {
        path: '/line/analysis',
        name: 'QualityAnalysis',
        component: () => import('@/views/business/line/Analysis.vue'),
        meta: {
          title: '质量分析',
          icon: 'LineChartOutlined',
        },
      },
      {
        path: '/config/slice',
        name: 'SliceManage',
        component: () => import('@/views/business/config/Slice.vue'),
        meta: {
          title: '切片管理',
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
