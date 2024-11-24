import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, authApi } from '@/api/modules/auth'
import { message } from 'ant-design-vue'
export interface UserInfo {
  name: string
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)

  // 初始化或刷新时加载用户信息
  async function loadUserInfo() {
    // 如果已经有用户信息，就不需要重新加载
    if (userInfo.value) return

    // 检查是否有 token
    const token = auth.getToken()
    if (!token) return

    try {
      // 使用 token 获取用户信息
      const info = await authApi.getProfile()
      userInfo.value = info
    } catch (error) {
      // 如果获取失败，清除 token 和用户信息
      // auth.removeToken()
      // userInfo.value = null
      message.error('获取用户信息失败')
    }
  }

  async function logout() {
    await authApi.logout() // 这里会同时处理 token 的清除
    userInfo.value = null
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  const isLoggedIn = computed(() => !!auth.getToken())

  return {
    userInfo,
    isLoggedIn,
    loadUserInfo,
    logout,
    setUserInfo,
  }
})
