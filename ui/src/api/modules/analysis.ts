import request from '../request'
import { API_ROUTES } from '../config'
import type { AnalysisFormState, AnalysisTableItem } from '@/types/analysis'

export const analysisApi = {
  async getList(
    params: { page?: number; pageSize?: number; keyword?: string } = {}
  ) {
    const response = await request.get<
      any,
      { items: AnalysisTableItem[]; total: number }
    >(API_ROUTES.analysis.list, { params })

    return {
      items: response.items,
      total: response.total,
    }
  },

  async create(data: AnalysisFormState) {
    const response = await request.post<any, AnalysisTableItem>(
      API_ROUTES.analysis.create,
      data
    )
    return response
  },

  async update(id: string, data: Partial<AnalysisTableItem>) {
    const url = API_ROUTES.analysis.update.replace(':id', id)
    const response = await request.put<any, AnalysisTableItem>(url, data)
    return response
  },

  async delete(id: string) {
    const url = API_ROUTES.analysis.delete.replace(':id', id)
    return request.delete(url)
  },

  async start(id: string) {
    const url = API_ROUTES.analysis.start.replace(':id', id)
    return request.post(url)
  },

  async stop(id: string) {
    const url = API_ROUTES.analysis.stop.replace(':id', id)
    return request.post(url)
  },
}
