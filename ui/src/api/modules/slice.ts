import request from '../request'
import { API_ROUTES } from '../config'
import type { SliceFormState, SliceTableItem } from '@/types/slice'

export const sliceApi = {
  async getList(
    params: { page?: number; pageSize?: number; keyword?: string } = {}
  ) {
    const response = await request.get<
      any,
      { items: SliceTableItem[]; total: number }
    >(API_ROUTES.config.slice.list, { params })
    return response
  },

  async create(data: SliceFormState) {
    const response = await request.post<any, SliceTableItem>(
      API_ROUTES.config.slice.create,
      data
    )
    return response
  },

  async update(id: string, data: Partial<SliceFormState>) {
    const url = API_ROUTES.config.slice.update.replace(':id', id)
    const response = await request.put<any, SliceTableItem>(url, data)
    return response
  },

  async delete(id: string) {
    const url = API_ROUTES.config.slice.delete.replace(':id', id)
    return request.delete(url)
  },
}
