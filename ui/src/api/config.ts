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
    list: '/api/line-analysis/task/list',
    create: '/api/line-analysis/task/create',
    update: '/api/line-analysis/task/:id',
    delete: '/api/line-analysis/task/:id',
    start: '/api/line-analysis/task/:id/start',
    stop: '/api/line-analysis/task/:id/stop',
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
    list: '/api/line-monitor/lines',
    update: '/api/line-monitor/lines/:id',
    delete: '/api/line-monitor/lines/:id',
    create: '/api/line-monitor/lines',
  },
} as const
