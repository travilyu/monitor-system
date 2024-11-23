import request from '../request'
import { API_ROUTES } from '../config'

interface ChartData {
  date: string
  value: number
  type: string
  text?: string
}

export const dashboardApi = {
  async getUserActivity(): Promise<ChartData[]> {
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return [
        { date: '2024-01-01 12:00', value: 75, type: '日活', text: '日活 75%' },
        { date: '2024-01-01 13:00', value: 78, type: '日活', text: '日活 78%' },
        { date: '2024-01-01 14:00', value: 80, type: '日活', text: '日活 80%' },
        { date: '2024-01-01 12:00', value: 65, type: '月活', text: '月活 65%' },
        { date: '2024-01-01 13:00', value: 68, type: '月活', text: '月活 68%' },
        { date: '2024-01-01 14:00', value: 70, type: '月活', text: '月活 70%' },
      ]
    }
    return request.get<any, ChartData[]>(API_ROUTES.dashboard.userActivity)
  },

  async getUserGrowth(): Promise<ChartData[]> {
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return [
        {
          date: '2024-01-01 12:00',
          value: 25,
          type: '增长率',
          text: '增长率 25%',
        },
        {
          date: '2024-01-01 13:00',
          value: 28,
          type: '增长率',
          text: '增长率 28%',
        },
        {
          date: '2024-01-01 14:00',
          value: 30,
          type: '增长率',
          text: '增长率 30%',
        },
      ]
    }
    return request.get<any, ChartData[]>(API_ROUTES.dashboard.userGrowth)
  },

  async getMessageStats(): Promise<ChartData[]> {
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return [
        {
          date: '2024-01-01 12:00',
          value: 120,
          type: '处理量',
          text: '处理量 120',
        },
        {
          date: '2024-01-01 13:00',
          value: 150,
          type: '处理量',
          text: '处理量 150',
        },
        {
          date: '2024-01-01 14:00',
          value: 180,
          type: '处理量',
          text: '处理量 180',
        },
      ]
    }
    return request.get<any, ChartData[]>(API_ROUTES.dashboard.messageStats)
  },
}
