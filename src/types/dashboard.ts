export interface ChartData {
  date: string
  value: number
}

export interface ChartInfo {
  title: string
  data: ChartData[]
}

export interface DashboardCard {
  id: number
  name: string
  data: {
    charts: ChartInfo[]
    summary: string
  }
  loading?: boolean
}
