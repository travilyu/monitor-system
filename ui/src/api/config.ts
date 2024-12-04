// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development'

// 根据环境导出不同的基础URL
export const API_BASE_URL = isDev
  ? 'http://localhost:3000/'
  : `${window.location.protocol}//${window.location.host}/`

// 如果需要更多环境相关的配置
export const API_CONFIG = {
  timeout: 10000, // API 超时时间
  withCredentials: true, // 跨域请求是否需要凭证
}

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
