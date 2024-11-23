import request from '../request'
import { API_ROUTES } from '../config'

interface SliceItem {
  id: number
  name: string
  description: string
  status: string
  createTime: string
}

export const configApi = {
  slice: {
    async getList() {
      if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
          items: Array(10)
            .fill(0)
            .map((_, index) => ({
              id: index + 1,
              name: `切片 ${index + 1}`,
              description: `切片 ${index + 1} 的描述`,
              status: index % 2 === 0 ? 'active' : 'inactive',
              createTime: new Date().toISOString(),
            })),
          total: 100,
        }
      }
      return request.get<any, { items: SliceItem[]; total: number }>(
        API_ROUTES.config.slice.list
      )
    },

    async create(data: Partial<SliceItem>) {
      return request.post<any, SliceItem>(API_ROUTES.config.slice.create, data)
    },

    async update(id: number, data: Partial<SliceItem>) {
      const url = API_ROUTES.config.slice.update.replace(':id', String(id))
      return request.put<any, SliceItem>(url, data)
    },

    async delete(id: number) {
      const url = API_ROUTES.config.slice.delete.replace(':id', String(id))
      return request.delete(url)
    },
  },
}
