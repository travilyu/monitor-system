// API 基础配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// API 路由配置
export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  monitor: {
    list: '/monitor/list',
    create: '/monitor/create',
    update: '/monitor/:id',
    delete: '/monitor/:id',
  },
} as const
