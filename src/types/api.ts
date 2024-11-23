// API 响应的基础类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 登录响应的类型
export interface LoginResponse {
  token: string
  userInfo: {
    name: string
    avatar: string
  }
}

// 监控列表响应的类型
export interface MonitorListResponse {
  items: Array<{
    id: number
    name: string
    status: 'enabled' | 'disabled'
    createTime: string
  }>
  total: number
}
