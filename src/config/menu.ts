import MonitorOutlined from '@ant-design/icons-vue/MonitorOutlined'
import SettingOutlined from '@ant-design/icons-vue/SettingOutlined'
import type { FunctionalComponent } from 'vue'

export interface MenuItem {
  key: string
  label: string
  icon: FunctionalComponent
  path: string
  children?: MenuItem[]
}

export const MENU_ITEMS: MenuItem[] = [
  {
    key: 'monitor',
    label: '监控管理',
    icon: MonitorOutlined,
    path: '/monitor',
  },
  {
    key: 'config',
    label: '配置管理',
    icon: SettingOutlined,
    path: '/config',
  },
]

// 根据路径获取面包屑
export function getBreadcrumbItems(path: string) {
  const items: Array<{ title: string; path?: string; isLast?: boolean }> = []

  // 首页
  items.push({
    title: '首页',
    path: '/',
  })

  // 查找当前路径对应的菜单项
  const currentMenu = MENU_ITEMS.find((item) => item.path === path)
  if (currentMenu) {
    items.push({
      title: currentMenu.label,
      isLast: true,
    })
  }

  return items
}
