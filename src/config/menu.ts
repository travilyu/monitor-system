import MonitorOutlined from '@ant-design/icons-vue/MonitorOutlined'
import SettingOutlined from '@ant-design/icons-vue/SettingOutlined'
import LineChartOutlined from '@ant-design/icons-vue/LineChartOutlined'
import type { Component } from 'vue'

export interface MenuItem {
  key: string
  label: string
  icon: Component
  path?: string
  children?: MenuItem[]
}

// 默认展开的菜单 keys
export const DEFAULT_OPEN_KEYS = ['line', 'config']

export const MENU_ITEMS: MenuItem[] = [
  {
    key: 'line',
    label: '线路管理',
    icon: LineChartOutlined,
    children: [
      {
        key: 'line-monitor',
        label: '线路监控',
        icon: MonitorOutlined,
        path: '/line/monitor',
      },
      {
        key: 'quality-analysis',
        label: '质量分析',
        icon: LineChartOutlined,
        path: '/line/analysis',
      },
    ],
  },
  {
    key: 'config',
    label: '配置管理',
    icon: SettingOutlined,
    children: [
      {
        key: 'slice-manage',
        label: '切片管理',
        icon: SettingOutlined,
        path: '/config/slice',
      },
    ],
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

  // 查找当前路径对应的菜单项及其父级
  for (const menu of MENU_ITEMS) {
    if (menu.children) {
      const child = menu.children.find((item) => item.path === path)
      if (child) {
        items.push({
          title: menu.label,
          path: menu.path,
        })
        items.push({
          title: child.label,
          isLast: true,
        })
        break
      }
    }
  }

  return items
}
