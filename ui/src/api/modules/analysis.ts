import request from '../request'
import { API_ROUTES } from '../config'
import type { AnalysisFormState, AnalysisTableItem } from '@/types/analysis'

interface AnalysisListResponse {
  items: AnalysisTableItem[]
  total: number
}

interface ApiAnalysisItem {
  id: string
  name: string
  test_type: string
  probe_count: number
  interval: number
  max_retries: number
  timeout: number
  jitter_threshold: number
  loss_threshold: number
  delay_threshold: number
  ip_type: 'IPv4' | 'domain'
  dest_ip: string
  next_hop_address?: string
  source_ip?: string
  line_id: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

const transformResponse = (item: ApiAnalysisItem): AnalysisTableItem => ({
  id: item.id,
  name: item.name,
  testType: item.test_type,
  probeCount: item.probe_count,
  interval: item.interval,
  maxRetries: item.max_retries,
  timeout: item.timeout,
  jitterThreshold: item.jitter_threshold,
  lossThreshold: item.loss_threshold,
  delayThreshold: item.delay_threshold,
  ipType: item.ip_type,
  destIp: item.dest_ip,
  nextHopAddress: item.next_hop_address,
  sourceIp: item.source_ip,
  lineId: item.line_id,
  status: item.status,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
})

const transformRequest = (data: AnalysisFormState) => ({
  name: data.name,
  test_type: data.testType,
  probe_count: data.probeCount,
  interval: data.interval,
  max_retries: data.maxRetries,
  timeout: data.timeout,
  jitter_threshold: data.jitterThreshold,
  loss_threshold: data.lossThreshold,
  delay_threshold: data.delayThreshold,
  ip_type: data.ipType,
  dest_ip: data.destIp,
  next_hop_address: data.nextHopAddress,
  source_ip: data.sourceIp,
  line_id: data.lineId,
})

export const analysisApi = {
  async getList(
    params: { page?: number; pageSize?: number; keyword?: string } = {}
  ) {
    if (process.env.NODE_ENV === 'development') {
      const mockData: AnalysisTableItem[] = Array(10)
        .fill(0)
        .map((_, index) => ({
          id: `${index + 1}`,
          name: `Ping测试 ${index + 1}`,
          testType: 'ICMP-ECHO',
          probeCount: 60,
          interval: 1000,
          maxRetries: 3,
          timeout: 1,
          jitterThreshold: 20,
          lossThreshold: 5,
          delayThreshold: 2000,
          ipType: 'IPv4',
          destIp: `192.168.1.${index + 1}`,
          nextHopAddress: '',
          sourceIp: '',
          lineId: '5G',
          status: index % 2 === 0 ? 'active' : 'inactive',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))

      return {
        items: mockData,
        total: 100,
      }
    }

    const response = await request.get<
      any,
      { items: ApiAnalysisItem[]; total: number }
    >(API_ROUTES.analysis.list, { params })

    return {
      items: response.items.map(transformResponse),
      total: response.total,
    }
  },

  async create(data: AnalysisFormState) {
    const response = await request.post<any, ApiAnalysisItem>(
      API_ROUTES.analysis.create,
      transformRequest(data)
    )
    return transformResponse(response)
  },

  async update(id: string, data: Partial<AnalysisFormState>) {
    const url = API_ROUTES.analysis.update.replace(':id', id)
    const response = await request.put<any, ApiAnalysisItem>(
      url,
      transformRequest(data as AnalysisFormState)
    )
    return transformResponse(response)
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
