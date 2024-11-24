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
    list: '/ping/task/list',
    create: '/ping/task/create',
    update: '/ping/task/:id',
    delete: '/ping/task/:id',
    start: '/ping/task/:id/start',
    stop: '/ping/task/:id/stop',
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
