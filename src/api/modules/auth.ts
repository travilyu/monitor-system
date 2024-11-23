import request, { auth } from '../request'
import { API_ROUTES } from '../config'
import type { LoginParams } from '@/types/user'
import type { LoginResponse } from '@/types/api'
import { useUserStore } from '@/stores/user'

export const authApi = {
  async login(params: LoginParams) {
    if (process.env.NODE_ENV === 'development') {
      const mockResponse: LoginResponse = {
        token: 'dev-token',
        userInfo: {
          name: params.username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`,
        },
      }

      auth.setToken(mockResponse.token)
      const userStore = useUserStore()
      userStore.setUserInfo(mockResponse.userInfo)

      return mockResponse
    }

    const response = await request.post<any, LoginResponse>(
      API_ROUTES.auth.login,
      params
    )
    auth.setToken(response.token)
    const userStore = useUserStore()
    userStore.setUserInfo(response.userInfo)
    return response
  },

  async logout() {
    if (process.env.NODE_ENV === 'development') {
      auth.removeToken()
      const userStore = useUserStore()
      await userStore.logout()
      return
    }

    await request.post<any, void>(API_ROUTES.auth.logout)
    auth.removeToken()
    const userStore = useUserStore()
    await userStore.logout()
  },

  async getProfile() {
    if (process.env.NODE_ENV === 'development') {
      const userInfo = {
        name: 'Dev User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
      }
      const userStore = useUserStore()
      userStore.setUserInfo(userInfo)
      return userInfo
    }
    const userInfo = await request.get<any, LoginResponse['userInfo']>(
      API_ROUTES.auth.profile
    )
    const userStore = useUserStore()
    userStore.setUserInfo(userInfo)
    return userInfo
  },
}
