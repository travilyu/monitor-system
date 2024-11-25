export interface TimeSeriesData {
  timestamp: string
  value: number
}

export interface LineData {
  id: string
  uuid: string
  name: string
  description: string
  vlan: number
  bandwidth: number | string // 单位bps
  throughputMonitoring?: TimeSeriesData[]
  latencyMonitoring?: TimeSeriesData[]
  packetLossMonitoring?: TimeSeriesData[]
  jitterMonitoring?: TimeSeriesData[]
  qualityAnalysisPolicy?: string
  status?: 'success' | 'error'
}

export interface MonitoringData {
  current: number
  series: TimeSeriesData[]
}
