import request from '@/utils/request'
import type { LineData } from '@/types/lineMonitor'

export const lineMonitorApi = {
  getLines() {
    return request.get<LineData[]>('/api/lines')
  },

  updateLine(id: string, data: Partial<LineData>) {
    return request.put(`/api/lines/${id}`, data)
  },

  deleteLine(id: string) {
    return request.delete(`/api/lines/${id}`)
  },
}
