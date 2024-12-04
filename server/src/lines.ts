import * as restify from 'restify'
import { Line, Analysis } from './models'
import { authMiddleware } from './auth'
import { prometheusService } from './services/prometheus'

// 从 Prometheus 获取监控数据
async function getMetrics(lineId: number) {
  return prometheusService.getAllMetrics(lineId)
}

export const setupLineRoutes = (server: restify.Server) => {
  // 获取所有线路
  server.get('/api/line-monitor/lines', authMiddleware, async (req, res) => {
    try {
      const lines = await Line.findAll({

      })

      const enrichedLines = await Promise.all(
        lines.map(async (line) => {
          let metrics = null

          try {
            metrics = await getMetrics(line.id)
          } catch (error) {
            console.error('Failed to get metrics:', error)
            metrics = {
              throughputMonitoring: [],
              latencyMonitoring: [],
              packetLossMonitoring: [],
              jitterMonitoring: [],
            }
          }

          return {
            ...line.toJSON(),
            ...metrics,
            qualityAnalysisPolicy: line.Analysis?.name || null,
          }
        })
      )

      res.send({ data: enrichedLines })
    } catch (err) {
      console.error(err)
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
        const line = await Line.findOne({
          where: { uuid: idOrUuid },
          include: [
            {
              model: Analysis,
              attributes: ['name'],
              where: { status: 'active' },
              required: false,
              order: [['updatedAt', 'DESC']],
              limit: 1,
            },
          ],
        })

        if (!line) {
          res.send(404, { error: 'Line not found' })
          return
        }

        let metrics = null
        try {
          metrics = await getMetrics(line.id)
        } catch (error) {
          console.error('Failed to get metrics:', error)
          metrics = {
            throughputMonitoring: [],
            latencyMonitoring: [],
            packetLossMonitoring: [],
            jitterMonitoring: [],
          }
        }

        res.send({
          ...line.toJSON(),
          ...metrics,
          qualityAnalysisPolicy: line.Analysis?.name || null,
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
