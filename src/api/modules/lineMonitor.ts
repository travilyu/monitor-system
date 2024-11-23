import request from '../request'
import { API_ROUTES } from '../config'
import type { LineData } from '@/types/lineMonitor'

const generateMockData = (): LineData[] => {
  return Array(10)
    .fill(0)
    .map((_, index) => ({
      id: `line-${index + 1}`,
      name: `线路 ${index + 1}`,
      description: `这是第 ${index + 1} 条线路的描述`,
      vlan: 100 + index,
      bandwidth: 1000000000 + index * 100000000, // 1Gbps 起步
      throughputMonitoring: generateTimeSeriesData(80, 95), // 80-95% 带宽利用率
      latencyMonitoring: generateTimeSeriesData(10, 50), // 10-50ms 延迟
      packetLossMonitoring: generateTimeSeriesData(0, 2), // 0-2% 丢包率
      jitterMonitoring: generateTimeSeriesData(1, 10), // 1-10ms 抖动
      qualityAnalysisPolicy: `/analysis/policy/${index + 1}`,
      status: index % 3 === 0 ? 'error' : 'success',
    }))
}

const generateTimeSeriesData = (min: number, max: number) => {
  return Array(24)
    .fill(0)
    .map((_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600 * 1000).toISOString(),
      value: min + Math.random() * (max - min),
    }))
}

export const lineMonitorApi = {
  async getLines() {
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟网络延迟
      return {
        data: generateMockData(),
      }
    }
    return request.get<any, { data: LineData[] }>(API_ROUTES.lineMonitor.list)
  },

  async updateLine(id: string, data: Partial<LineData>) {
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    }
    const url = API_ROUTES.lineMonitor.update.replace(':id', id)
    return request.put(url, data)
  },

  async deleteLine(id: string) {
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    }
    const url = API_ROUTES.lineMonitor.delete.replace(':id', id)
    return request.delete(url)
  },
}
