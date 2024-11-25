<template>
  <div class="user-info">
    <a-dropdown>
      <a class="user-dropdown-link" @click.prevent>
        <a-avatar :src="userInfo?.avatar" />
        <span class="username">{{ userInfo?.name }}</span>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item key="logout" @click="handleLogout">
            <LogoutOutlined />
            退出登录
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import LogoutOutlined from '@ant-design/icons-vue/LogoutOutlined'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const handleLogout = async () => {
  try {
    await userStore.logout()
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
