import request from '../request'
import { API_ROUTES } from '../config'
import type {
  AnalysisItem,
  AnalysisParams,
  AnalysisListResponse,
} from '@/types/analysis'

export const api = {
  async getList(params: AnalysisParams = {}) {
    if (process.env.NODE_ENV === 'development') {
      const mockData: AnalysisItem[] = Array(50)
        .fill(0)
        .map((_, index) => ({
          id: index + 1,
          name: `分析项 ${index + 1}`,
          description: `这是第 ${index + 1} 个分析项的描述`,
          status: index % 2 === 0 ? 'enabled' : 'disabled',
          createTime: new Date().toISOString(),
        }))

      const mockResponse: AnalysisListResponse = {
        total: mockData.length,
        items: mockData,
      }
      return mockResponse
    }
    return request.get<any, AnalysisListResponse>(API_ROUTES.analysis.list, {
      params,
    })
  },

  async create(data: AnalysisItem) {
    return request.post<any, AnalysisItem>(API_ROUTES.analysis.create, data)
  },

  async update(id: number, data: Partial<AnalysisItem>) {
    const url = API_ROUTES.analysis.update.replace(':id', String(id))
    return request.put<any, AnalysisItem>(url, data)
  },

  async delete(id: number) {
    const url = API_ROUTES.analysis.delete.replace(':id', String(id))
    return request.delete<any, void>(url)
  },
}
