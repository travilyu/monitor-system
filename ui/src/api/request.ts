import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { auth } from './modules/auth'
import { API_BASE_URL } from './config'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = auth.getToken()
    if (token) {
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
  (response: AxiosResponse) => {
    // 2xx 的状态码都表示成功
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    return Promise.reject(new Error(response.statusText))
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      auth.removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
