import axios from 'axios'
import config from '../config'

export class PrometheusService {
  private prometheusUrl: string
  private headers: Record<string, string>

  constructor() {
    this.prometheusUrl = config.prometheus.url

    // 设置认证头
    this.headers = {}
    if (config.prometheus.auth?.token) {
      this.headers['Authorization'] = `Bearer ${config.prometheus.auth.token}`
    } else if (
      config.prometheus.auth?.username &&
      config.prometheus.auth?.password
    ) {
      const auth = Buffer.from(
        `${config.prometheus.auth.username}:${config.prometheus.auth.password}`
      ).toString('base64')
      this.headers['Authorization'] = `Basic ${auth}`
    }
  }

  // 替换查询中的变量
  private replaceVariables(
    query: string,
    variables: Record<string, string>
  ): string {
    let result = query
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
    return result
  }

  // 执行 Prometheus 查询
  private async executeQuery(
    query: string,
    start: number,
    end: number,
    step: number
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${this.prometheusUrl}/api/v1/query_range`,
        {
          params: {
            query,
            start,
            end,
            step,
          },
          headers: this.headers, // 添加认证头
        }
      )

      if (response.data.status === 'success') {
        return response.data.data.result
      }
      throw new Error('Prometheus query failed')
    } catch (error) {
      console.error('Prometheus query error:', error)
      throw error
    }
  }

  // 获取指标数据
  async getMetric(
    metricName: string,
    lineId: string,
    hours: number = 24,
    step: number = 300 // 5分钟
  ) {
    const query = config.prometheus.queries.metrics[metricName]
    if (!query) {
      throw new Error(`Unknown metric: ${metricName}`)
    }

    const end = Math.floor(Date.now() / 1000)
    const start = end - hours * 3600

    const finalQuery = this.replaceVariables(query.query, { lineId })
    const result = await this.executeQuery(finalQuery, start, end, step)

    // 转换数据格式
    return (
      result[0]?.values.map(([timestamp, value]: [number, string]) => ({
        timestamp: new Date(timestamp * 1000).toISOString(),
        value: Number(value),
      })) || []
    )
  }

  // 获取所有监控指标
  async getAllMetrics(lineId: string) {
    try {
      const [throughput, latency, packetLoss, jitter] = await Promise.all([
        this.getMetric('throughput', lineId),
        this.getMetric('latency', lineId),
        this.getMetric('packet_loss', lineId),
        this.getMetric('jitter', lineId),
      ])

      return {
        throughputMonitoring: throughput,
        latencyMonitoring: latency,
        packetLossMonitoring: packetLoss,
        jitterMonitoring: jitter,
      }
    } catch (error) {
      console.error('Failed to get metrics:', error)
      // 如果 Prometheus 查询失败，返回模拟数据
      return this.getMockMetrics()
    }
  }

  // 生成模拟数据（当 Prometheus 不可用时使用）
  private getMockMetrics() {
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

    return {
      throughputMonitoring: generateTimeSeriesData(80, 95),
      latencyMonitoring: generateTimeSeriesData(10, 50),
      packetLossMonitoring: generateTimeSeriesData(0, 2),
      jitterMonitoring: generateTimeSeriesData(1, 10),
    }
  }
}

// 导出单例
export const prometheusService = new PrometheusService()
