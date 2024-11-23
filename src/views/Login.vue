<template>
  <div class="login-container">
    <a-card class="login-card" :bordered="false">
      <h2 class="login-title">系统登录</h2>

      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        @finish="handleFinish"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { authApi } from '@/api/modules/auth'
import type { LoginParams } from '@/types/user'

const router = useRouter()
const loading = ref(false)

const formState = reactive<LoginParams>({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}

const handleFinish = async (values: LoginParams) => {
  loading.value = true
  try {
    await authApi.login(values)
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error('登录失败：' + (error as Error).message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 380px;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 24px;
}
</style>
