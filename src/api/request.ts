import axios from 'axios'
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { message } from 'ant-design-vue'
import { API_BASE_URL } from './config'
import type { ApiResponse } from '@/types/api'

// Token 相关的常量
export const TOKEN_KEY = 'auth_token'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    if (data.code === 0) {
      return data.data
    }

    message.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem(TOKEN_KEY)
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error('网络错误')
      }
    } else {
      message.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default request

// 导出 token 相关的工具函数
export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
}
