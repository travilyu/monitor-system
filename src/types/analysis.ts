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
