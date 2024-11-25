// API 基础配置
export const API_BASE_URL = 'http://localhost:3000/'

// API 路由配置
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
  },
  monitor: {
    stats: '/line/monitor/stats',
    activity: '/line/monitor/activity',
    growth: '/line/monitor/growth',
  },
  analysis: {
    list: '/api/line-analysis/tasks',
    create: '/api/line-analysis/tasks',
    update: '/api/line-analysis/tasks/:id',
    delete: '/api/line-analysis/tasks/:id',
    start: '/api/line-analysis/tasks/:id/start',
    stop: '/api/line-analysis/tasks/:id/stop',
  },
  config: {
    slice: {
      list: '/api/line-config/slice/list',
      create: '/api/line-config/slice',
      update: '/api/line-config/slice/:id',
      delete: '/api/line-config/slice/:id',
    },
  },
  lineMonitor: {
    list: '/api/line-monitor/lines',
    update: '/api/line-monitor/lines/:id',
    delete: '/api/line-monitor/lines/:id',
    create: '/api/line-monitor/lines',
  },
} as const
