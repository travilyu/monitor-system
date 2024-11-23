import request from '../request'
import { API_ROUTES } from '../config'
import type { MonitorItem, MonitorParams } from '@/types/monitor'
import type { MonitorListResponse } from '@/types/api'

export const monitorApi = {
  async getList(params: MonitorParams) {
    if (process.env.NODE_ENV === 'development') {
      const mockData: MonitorItem[] = Array(50)
        .fill(0)
        .map((_, index) => ({
          id: index + 1,
          name: `监控项 ${index + 1}`,
          status: index % 2 === 0 ? 'enabled' : 'disabled',
          createTime: new Date().toISOString(),
        }))

      const mockResponse: MonitorListResponse = {
        total: mockData.length,
        items: mockData,
      }
      return mockResponse
    }
    return request.get<any, MonitorListResponse>(API_ROUTES.monitor.list, {
      params,
    })
  },

  async create(data: MonitorItem) {
    return request.post<any, MonitorItem>(API_ROUTES.monitor.create, data)
  },

  async update(id: number, data: Partial<MonitorItem>) {
    const url = API_ROUTES.monitor.update.replace(':id', String(id))
    return request.put<any, MonitorItem>(url, data)
  },

  async delete(id: number) {
    const url = API_ROUTES.monitor.delete.replace(':id', String(id))
    return request.delete<any, void>(url)
  },
}
