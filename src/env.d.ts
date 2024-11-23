/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue 相关
declare module 'vue' {
  import {
    createApp,
    ref,
    reactive,
    computed,
    type Ref,
  } from '@vue/runtime-dom'
  export { createApp, ref, reactive, computed, type Ref }
}

// Vue Router 相关
declare module 'vue-router' {
  import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
    type NavigationGuardNext,
    type RouteLocationNormalized,
  } from '@vue/router'
  export {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
    type NavigationGuardNext,
    type RouteLocationNormalized,
  }
}

// Pinia 相关
declare module 'pinia' {
  import { createPinia, defineStore } from '@pinia/runtime-core'
  export { createPinia, defineStore }
}

// Ant Design Vue 相关
declare module 'ant-design-vue' {
  const antd: any
  export default antd
  export const message: any
}

declare module '@ant-design/icons-vue' {
  const IconComponent: any
  export default IconComponent
  export const UserOutlined: any
  export const LockOutlined: any
  export const MenuFoldOutlined: any
  export const MenuUnfoldOutlined: any
}
