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
// declare module 'vue' {
//   import {
//     createApp,
//     ref,
//     reactive,
//     computed,
//     type Ref,
//   } from '@vue/runtime-dom'
//   export { createApp, ref, reactive, computed, type Ref }
// }

// Vue Router 相关

// Pinia 相关

// Ant Design Vue 相关
