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
    stats: '/line/monitor/stats',
    activity: '/line/monitor/activity',
    growth: '/line/monitor/growth',
  },
  analysis: {
    list: '/line/analysis/list',
    create: '/line/analysis',
    update: '/line/analysis/:id',
    delete: '/line/analysis/:id',
  },
  config: {
    slice: {
      list: '/config/slice/list',
      create: '/config/slice/create',
      update: '/config/slice/:id',
      delete: '/config/slice/:id',
    },
  },
  lineMonitor: {
    list: '/api/line-monitor/list',
    update: '/api/line-monitor/:id',
    delete: '/api/line-monitor/:id',
  },
} as const
