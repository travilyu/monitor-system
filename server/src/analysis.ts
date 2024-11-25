import * as restify from 'restify'
import { Analysis, Line } from './models'
import { authMiddleware } from './auth'
import { Op } from 'sequelize'

export const setupAnalysisRoutes = (server: restify.Server) => {
  // 获取分析任务列表
  server.get(
    '/api/line-analysis/task/list',
    authMiddleware,
    async (req, res) => {
      try {
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 10
        const keyword = req.query.keyword as string

        const where = keyword
          ? {
              [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { destIp: { [Op.like]: `%${keyword}%` } },
              ],
            }
          : {}

        const { count, rows } = await Analysis.findAndCountAll({
          where,
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [['createdAt', 'DESC']],
        })

        res.send({
          items: rows,
          total: count,
        })
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 创建分析任务
  server.post(
    '/api/line-analysis/task/create',
    authMiddleware,
    async (req, res) => {
      try {
        // 验证关联的线路是否存在
        const line = await Line.findOne({
          where: { uuid: req.body.lineUuid },
        })

        if (!line) {
          res.send(400, { error: 'Associated line not found' })
          return
        }

        const task = await Analysis.create(req.body)
        res.send(201, task)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 更新分析任务
  server.put(
    '/api/line-analysis/task/:uuid',
    authMiddleware,
    async (req, res) => {
      try {
        const task = await Analysis.findOne({
          where: { uuid: req.params.uuid },
        })

        if (!task) {
          res.send(404, { error: 'Task not found' })
          return
        }

        if (req.body.lineUuid) {
          const line = await Line.findOne({
            where: { uuid: req.body.lineUuid },
          })

          if (!line) {
            res.send(400, { error: 'Associated line not found' })
            return
          }
        }

        await task.update(req.body)
        res.send(200, task)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 删除分析任务
  server.del(
    '/api/line-analysis/task/:uuid',
    authMiddleware,
    async (req, res) => {
      try {
        const task = await Analysis.findOne({
          where: { uuid: req.params.uuid },
        })

        if (!task) {
          res.send(404, { error: 'Task not found' })
          return
        }

        await task.destroy()
        res.send(204)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 启动分析任务
  server.post(
    '/api/line-analysis/task/:uuid/start',
    authMiddleware,
    async (req, res) => {
      try {
        const task = await Analysis.findOne({
          where: { uuid: req.params.uuid },
        })

        if (!task) {
          res.send(404, { error: 'Task not found' })
          return
        }

        await task.update({ status: 'active' })
        // TODO: 实际启动分析任务的逻辑

        res.send(200, { success: true })
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 停止分析任务
  server.post(
    '/api/line-analysis/task/:uuid/stop',
    authMiddleware,
    async (req, res) => {
      try {
        const task = await Analysis.findOne({
          where: { uuid: req.params.uuid },
        })

        if (!task) {
          res.send(404, { error: 'Task not found' })
          return
        }

        await task.update({ status: 'inactive' })
        // TODO: 实际停止分析任务的逻辑

        res.send(200, { success: true })
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )
}
