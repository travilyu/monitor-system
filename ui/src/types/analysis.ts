export interface AnalysisItem {
  id?: number
  name: string
  description: string
  status: 'enabled' | 'disabled'
  createTime: string
}

export interface AnalysisParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface AnalysisListResponse {
  total: number
  items: AnalysisItem[]
}

export interface AnalysisFormState {
  name: string
  testType: string
  probeCount: number
  interval: number
  maxRetries: number
  timeout: number
  jitterThreshold: number
  lossThreshold: number
  delayThreshold: number
  ipType: 'IPv4' | 'domain'
  destIp: string
  nextHopAddress?: string
  sourceIp?: string
  lineUuid: string | undefined
}

export interface AnalysisTableItem extends AnalysisFormState {
  id: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface AnalysisState {
  loading: boolean
  drawer: {
    visible: boolean
    title: string
    initialValues: Partial<AnalysisTableItem>
  }
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}
