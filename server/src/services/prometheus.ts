import axios from 'axios'
import config from '../config'

export class PrometheusService {
  private prometheusUrl: string
  private headers: Record<string, string>

  constructor() {
    this.prometheusUrl = config.prometheus.url
    console.log('Prometheus URL:', this.prometheusUrl)

    // 设置认证头
    this.headers = {}
    if (config.prometheus.auth?.token) {
      this.headers['Authorization'] = `Bearer ${config.prometheus.auth.token}`
      console.log('Using token authentication')
    } else if (
      config.prometheus.auth?.username &&
      config.prometheus.auth?.password
    ) {
      const auth = Buffer.from(
        `${config.prometheus.auth.username}:${config.prometheus.auth.password}`
      ).toString('base64')
      this.headers['Authorization'] = `Basic ${auth}`
      console.log('Using basic authentication')
    }
  }

  // 替换查询中的变量
  private replaceVariables(
    query: string,
    variables: Record<string, string | number>
  ): string {
    let result = query
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value.toString())
    }
    console.log('Query after variable replacement:', result)
    return result
  }

  // 执行 Prometheus 查询
  private async executeQuery(
    query: string,
    start: number,
    end: number,
    step: number
  ): Promise<any> {
    const url = `${this.prometheusUrl}/api/v1/query_range`
    const params = {
      query,
      start,
      end,
      step,
    }

    let requestLog = '\n[Prometheus Query]\n'
    requestLog += `URL: ${url}\n`
    requestLog += `Params: ${JSON.stringify(params, null, 2)}\n`
    requestLog += `Headers: ${JSON.stringify(this.headers, null, 2)}`

    try {
      const response = await axios.get(url, {
        params,
        headers: this.headers,
      })

      requestLog += '\nResponse status: ' + response.status
      requestLog += '\nResponse data: ' + JSON.stringify(response.data, null, 2)
      console.log(requestLog)

      if (response.data.status === 'success') {
        return response.data.data.result
      }
      throw new Error('Prometheus query failed')
    } catch (error: any) {
      requestLog += '\n[Prometheus Error]'
      requestLog += '\nRequest failed: ' + error.message
      if (error.response) {
        requestLog += '\nResponse status: ' + error.response.status
        requestLog +=
          '\nResponse data: ' + JSON.stringify(error.response.data, null, 2)
      }
      console.error(requestLog)
      throw error
    }
  }

  // 获取指标数据
  async getMetric(
    metricName: string,
    lineId: number,
    hours: number = 24,
    step: number = 300 // 5分钟
  ) {
    console.log(`\n[Getting Metric: ${metricName}]`)
    console.log('Line ID:', lineId)
    console.log('Hours:', hours)
    console.log('Step:', step)

    const query = config.prometheus.queries.metrics[metricName]
    if (!query) {
      console.error('Unknown metric:', metricName)
      throw new Error(`Unknown metric: ${metricName}`)
    }

    const end = Math.floor(Date.now() / 1000)
    const start = end - hours * 3600

    const finalQuery = this.replaceVariables(query.query, { lineId })
    const result = await this.executeQuery(finalQuery, start, end, step)

    const transformedData =
      result[0]?.values.map(([timestamp, value]: [number, string]) => ({
        timestamp: new Date(timestamp * 1000).toISOString(),
        value: Number(value),
      })) || []

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2))
    return transformedData
  }

  // 获取线路状态
  async getLineStatus(
    lineId: number
  ): Promise<'success' | 'warning' | 'error' | 'unknown'> {
    console.log('\n[Getting Line Status]')
    console.log('Line ID:', lineId)

    try {
      const query = config.prometheus.queries.metrics.status
      if (!query) {
        console.error('Status metric query not configured')
        return 'error'
      }

      const end = Math.floor(Date.now() / 1000)
      const start = end - 300 // 最近5分钟
      const step = 60 // 1分钟一个点

      const finalQuery = this.replaceVariables(query.query, { lineId })
      const result = await this.executeQuery(finalQuery, start, end, step)

      // 获取最新的一个值
      const lastValue = result[0]?.values?.slice(-1)[0]?.[1]
      if (!lastValue) {
        console.log('No status data available')
        return 'error'
      }

      const status = Number(lastValue)
      console.log('Raw status value:', status)

      // 转换状态码
      switch (status) {
        case 1:
          return 'success' // online
        case 2:
          return 'warning' // offline
        case 3:
          return 'error' // error or unknown
        default:
          return 'unknown'
      }
    } catch (error) {
      console.error('Failed to get line status:', error)
      return 'error'
    }
  }

  // 修改 getAllMetrics 方法，加入状态获取
  async getAllMetrics(lineId: number) {
    console.log('\n[Getting All Metrics]')
    console.log('Line ID:', lineId)

    try {
      const [throughput, latency, packetLoss, jitter, status] =
        await Promise.all([
          this.getMetric('throughput', lineId),
          this.getMetric('latency', lineId),
          this.getMetric('packet_loss', lineId),
          this.getMetric('jitter', lineId),
          this.getLineStatus(lineId),
        ])

      const result = {
        throughputMonitoring: throughput,
        latencyMonitoring: latency,
        packetLossMonitoring: packetLoss,
        jitterMonitoring: jitter,
        status, // 添加状态字段
      }

      return result
    } catch (error) {
      console.error('Failed to get metrics:', error)
      console.log('Falling back to mock data')
      return this.getMockMetrics()
    }
  }

  // 修改模拟数据，加入状态
  private getMockMetrics() {
    console.log('\n[Generating Mock Metrics]')

    const generateTimeSeriesData = (min: number, max: number) => {
      return Array(24)
        .fill(0)
        .map((_, i) => ({
          timestamp: new Date(
            Date.now() - (23 - i) * 3600 * 1000
          ).toISOString(),
          value: min + Math.random() * (max - min),
        }))
    }

    const mockData = {
      throughputMonitoring: generateTimeSeriesData(80, 95),
      latencyMonitoring: generateTimeSeriesData(10, 50),
      packetLossMonitoring: generateTimeSeriesData(0, 2),
      jitterMonitoring: generateTimeSeriesData(1, 10),
      status: 'success' as const, // 模拟数据默认返回 success
    }

    console.log('Mock data')
    return mockData
  }
}

// 导出单例
export const prometheusService = new PrometheusService()
