export interface MonitorItem {
  id?: number
  name: string
  status: 'enabled' | 'disabled'
  createTime?: string
}

export interface MonitorParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
}
