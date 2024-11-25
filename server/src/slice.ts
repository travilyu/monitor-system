import * as restify from 'restify'
import { Slice, Line } from './models'
import { authMiddleware } from './auth'
import { Op } from 'sequelize'

export const setupSliceRoutes = (server: restify.Server) => {
  // 获取切片列表
  server.get(
    '/api/line-config/slice/list',
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
                { description: { [Op.like]: `%${keyword}%` } },
              ],
            }
          : {}

        const { count, rows } = await Slice.findAndCountAll({
          where,
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order: [['createdAt', 'DESC']],
        })
        console.log(rows)

        res.send({
          items: rows,
          total: count,
        })
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 创建切片
  server.post('/api/line-config/slice', authMiddleware, async (req, res) => {
    try {
      // 验证绑定的线路是否存在且带宽合适
      const lines = await Line.findAll({
        where: {
          uuid: {
            [Op.in]: req.body.lineUuids,
          },
        },
      })

      if (lines.length !== req.body.lineUuids.length) {
        res.send(400, { error: 'Some lines not found' })
        return
      }

      // 检查带宽是否超过最小线路带宽
      const minBandwidth = Math.min(...lines.map((line) => line.bandwidth))
      if (req.body.bandwidth > minBandwidth) {
        res.send(400, {
          error: `Bandwidth cannot exceed minimum line bandwidth: ${minBandwidth}Mbps`,
        })
        return
      }

      const slice = await Slice.create(req.body)
      res.send(201, slice)
    } catch (err) {
      res.send(500, { error: 'Internal server error' })
    }
  })

  // 更新切片
  server.put(
    '/api/line-config/slice/:idOrUuid',
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

        const slice = await Slice.findOne({ where })

        if (!slice) {
          res.send(404, { error: 'Slice not found' })
          return
        }

        if (req.body.lineUuids) {
          // 验证绑定的线路是否存在且带宽合适
          const lines = await Line.findAll({
            where: {
              uuid: {
                [Op.in]: req.body.lineUuids,
              },
            },
          })

          if (lines.length !== req.body.lineUuids.length) {
            res.send(400, { error: 'Some lines not found' })
            return
          }

          // 检查带宽是否超过最小线路带宽
          const minBandwidth = Math.min(...lines.map((line) => line.bandwidth))
          if ((req.body.bandwidth || slice.bandwidth) > minBandwidth) {
            res.send(400, {
              error: `Bandwidth cannot exceed minimum line bandwidth: ${minBandwidth}Mbps`,
            })
            return
          }
        }

        await slice.update(req.body)
        res.send(200, slice)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )

  // 删除切片
  server.del(
    '/api/line-config/slice/:idOrUuid',
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

        const slice = await Slice.findOne({ where })

        if (!slice) {
          res.send(404, { error: 'Slice not found' })
          return
        }

        await slice.destroy()
        res.send(204)
      } catch (err) {
        res.send(500, { error: 'Internal server error' })
      }
    }
  )
}
