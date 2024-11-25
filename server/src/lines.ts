import * as restify from 'restify'
import { Line, Analysis } from './models'
import { authMiddleware } from './auth'
import { prometheusService } from './services/prometheus'

// 从 Prometheus 获取监控数据
async function getMetrics(lineId: string) {
  return prometheusService.getAllMetrics(lineId)
}

// 获取线路状态和策略
async function getLineAnalysis(lineUuid: string) {
  try {
    // 获取该线路的分析任务
    const task = await Analysis.findOne({
      where: {
        lineUuid,
      },
      order: [['updatedAt', 'DESC']], // 获取最新的任务
    })

    return {
      status: task
        ? task.status === 'active'
          ? 'success'
          : 'error'
        : 'warning',
      qualityAnalysisPolicy: task
        ? `/api/line-analysis/task/${task.uuid}`
        : null,
    }
  } catch (error) {
    console.error('Failed to get line analysis:', error)
    return {
      status: 'warning',
      qualityAnalysisPolicy: null,
    }
  }
}

export const setupLineRoutes = (server: restify.Server) => {
  // 获取所有线路
  server.get('/api/line-monitor/lines', authMiddleware, async (req, res) => {
    try {
      const lines = await Line.findAll()
      const enrichedLines = await Promise.all(
        lines.map(async (line) => {
          let metrics = null
          let analysis = null

          try {
            metrics = await getMetrics(line.uuid)
          } catch (error) {
            console.error('Failed to get metrics:', error)
            metrics = {
              throughputMonitoring: [],
              latencyMonitoring: [],
              packetLossMonitoring: [],
              jitterMonitoring: [],
            }
          }

          try {
            analysis = await getLineAnalysis(line.uuid)
          } catch (error) {
            console.error('Failed to get analysis:', error)
            analysis = {
              status: 'warning',
              qualityAnalysisPolicy: null,
            }
          }

          return {
            ...line.toJSON(),
            ...metrics,
            status: analysis.status,
            qualityAnalysisPolicy: analysis.qualityAnalysisPolicy,
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
          uuid: idOrUuid,
        }

        const line = await Line.findOne({ where })

        if (!line) {
          res.send(404, { error: 'Line not found' })
          return
        }

        let metrics = null
        let analysis = null

        try {
          metrics = await getMetrics(line.uuid)
        } catch (error) {
          console.error('Failed to get metrics:', error)
          metrics = {
            throughputMonitoring: [],
            latencyMonitoring: [],
            packetLossMonitoring: [],
            jitterMonitoring: [],
          }
        }

        try {
          analysis = await getLineAnalysis(line.uuid)
        } catch (error) {
          console.error('Failed to get analysis:', error)
          analysis = {
            status: 'warning',
            qualityAnalysisPolicy: null,
          }
        }

        res.send({
          ...line.toJSON(),
          ...metrics,
          status: analysis.status,
          qualityAnalysisPolicy: analysis.qualityAnalysisPolicy,
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
