import request from '../request'
import { API_ROUTES } from '../config'
import type { LoginParams } from '@/types/user'
import type { LoginResponse } from '@/types/api'
import { useUserStore } from '@/stores/user'

// Token 相关操作
export const TOKEN_KEY = 'auth_token'

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
}

export const authApi = {
  async login(params: LoginParams) {
    const response = await request.post<any, LoginResponse>(
      API_ROUTES.auth.login,
      params
    )
    const userStore = useUserStore()
    userStore.setUserInfo(response.userInfo)
    auth.setToken(response.token)
    return response
  },

  async logout() {
    await request.post<any, void>(API_ROUTES.auth.logout)
    const userStore = useUserStore()
    auth.removeToken()
    await userStore.logout()
  },

  async getProfile() {
    const userInfo = await request.get<any, LoginResponse['userInfo']>(
      API_ROUTES.auth.profile
    )
    const userStore = useUserStore()
    userStore.setUserInfo(userInfo)
    return userInfo
  },
}
