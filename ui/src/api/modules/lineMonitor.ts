import request from '../request'
import { API_ROUTES } from '../config'
import type { LineData } from '@/types/lineMonitor'

// 带宽单位转换函数
const convertBandwidthToMbps = (bps: number) => (bps / 1000000).toFixed(2)
const convertBandwidthToBps = (mbps: number) => mbps * 1000000

export const lineMonitorApi = {
  async getLines() {
    const response = await request.get<any, { data: LineData[] }>(
      API_ROUTES.lineMonitor.list
    )
    // 转换带宽单位为 Mbps
    return {
      data: response.data.map((line) => ({
        ...line,
        bandwidth: convertBandwidthToMbps(line.bandwidth),
      })),
    }
  },

  async updateLine(id: string, data: Partial<LineData>) {
    const url = API_ROUTES.lineMonitor.update.replace(':id', id)
    // 如果包含带宽，转换为 bps
    const convertedData = {
      ...data,
      bandwidth: data.bandwidth
        ? convertBandwidthToBps(data.bandwidth)
        : undefined,
    }
    return request.put(url, convertedData)
  },

  async deleteLine(id: string) {
    const url = API_ROUTES.lineMonitor.delete.replace(':id', id)
    return request.delete(url)
  },

  createLine(data: Omit<LineData, 'id'>) {
    // 转换带宽为 bps
    const convertedData = {
      ...data,
      bandwidth: convertBandwidthToBps(data.bandwidth),
    }
    return request({
      url: API_ROUTES.lineMonitor.create,
      method: 'POST',
      data: convertedData,
    })
  },
}
