import * as restify from 'restify'
import { Line } from './models'
import { authMiddleware } from './auth'

// 模拟从 Prometheus 获取监控数据
async function getMetricsFromPrometheus(lineId: string, metricType: string) {
  // TODO: 实现实际的 Prometheus 查询
  return Array(24)
    .fill(0)
    .map((_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600 * 1000).toISOString(),
      value: Math.random() * 100,
    }))
}

// 模拟从策略服务获取线路状态
async function getLineStatus(lineId: string) {
  // TODO: 实现实际的策略服务查询
  return Math.random() > 0.7 ? 'error' : 'success'
}

// 模拟从策略服务获取质量分析策略
async function getQualityAnalysisPolicy(lineId: string) {
  // TODO: 实现实际的策略服务查询
  return `/analysis/policy/${lineId}`
}

export const setupLineRoutes = (server: restify.Server) => {
  // 获取所有线路
  server.get('/api/line-monitor/lines', authMiddleware, async (req, res) => {
    try {
      const lines = await Line.findAll()
      const enrichedLines = await Promise.all(
        lines.map(async (line) => {
          const [throughput, latency, packetLoss, jitter, status, policy] =
            await Promise.all([
              getMetricsFromPrometheus(line.uuid, 'throughput'),
              getMetricsFromPrometheus(line.uuid, 'latency'),
              getMetricsFromPrometheus(line.uuid, 'packet_loss'),
              getMetricsFromPrometheus(line.uuid, 'jitter'),
              getLineStatus(line.uuid),
              getQualityAnalysisPolicy(line.uuid),
            ])

          return {
            ...line.toJSON(),
            throughputMonitoring: throughput,
            latencyMonitoring: latency,
            packetLossMonitoring: packetLoss,
            jitterMonitoring: jitter,
            status,
            qualityAnalysisPolicy: policy,
          }
        })
      )

      res.send({ data: enrichedLines })
    } catch (err) {
      res.send(500, { error: 'Internal server error' })
    }
  })

  // 获取单个线路
  server.get(
    '/api/line-monitor/lines/:idOrUuid',
    authMiddleware,
    async (req, res) => {
      try {
        const idOrUuid = req.params.idOrUuid
        let where: any = {
          id: idOrUuid,
        }
        if (isNaN(Number(idOrUuid))) {
          where = {
            uuid: idOrUuid,
          }
        }
        const line = await Line.findOne({ where })

        if (!line) {
          res.send(404, { error: 'Line not found' })
          return
        }

        const [throughput, latency, packetLoss, jitter, status, policy] =
          await Promise.all([
            getMetricsFromPrometheus(line.uuid, 'throughput'),
            getMetricsFromPrometheus(line.uuid, 'latency'),
            getMetricsFromPrometheus(line.uuid, 'packet_loss'),
            getMetricsFromPrometheus(line.uuid, 'jitter'),
            getLineStatus(line.uuid),
            getQualityAnalysisPolicy(line.uuid),
          ])

        res.send({
          ...line.toJSON(),
          throughputMonitoring: throughput,
          latencyMonitoring: latency,
          packetLossMonitoring: packetLoss,
          jitterMonitoring: jitter,
          status,
          qualityAnalysisPolicy: policy,
        })
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 创建线路
  server.post('/api/line-monitor/lines', authMiddleware, async (req, res) => {
    try {
      const line = await Line.create(req.body)
      res.send(201, line)
    } catch (err) {
      res.send(500, { error: 'Internal server error' })
    }
  })

  // 更新线路
  server.put(
    '/api/line-monitor/lines/:idOrUuid',
    authMiddleware,
    async (req, res) => {
      try {
        const idOrUuid = req.params.idOrUuid
        let where: any = {
          id: idOrUuid,
        }
        if (isNaN(Number(idOrUuid))) {
          where = {
            uuid: idOrUuid,
          }
        }
        const line = await Line.findOne({ where })

        if (!line) {
          res.send(404, { error: 'Line not found' })
          return
        }

        await line.update(req.body)
        res.send(200, line)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 删除线路
  server.del(
    '/api/line-monitor/lines/:idOrUuid',
    authMiddleware,
    async (req, res) => {
      try {
        const idOrUuid = req.params.idOrUuid
        let where: any = {
          id: idOrUuid,
        }
        if (isNaN(Number(idOrUuid))) {
          where = {
            uuid: idOrUuid,
          }
        }
        const line = await Line.findOne({ where })

        if (!line) {
          res.send(404, { error: 'Line not found' })
          return
        }

        await line.destroy()
        res.send(204)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )
}
