import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { User } from './models'

// 中间件：验证 JWT token
export const authMiddleware = async (
  req: restify.Request,
  res: restify.Response
) => {
  try {
    const authHeader = req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      res.send(401, { error: 'Unauthorized' })
      return false
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string
    }

    const user = await User.findOne({
      where: { uuid: decoded.id },
      attributes: ['uuid', 'username', 'name', 'avatar', 'role'],
    })

    if (!user) {
      res.send(401, { error: 'User not found' })
      return false
    }

    ;(req as any).user = user
    return true
  } catch (err) {
    res.send(401, { error: 'Invalid token' })
    return false
  }
}

export const setupAuthRoutes = (server: restify.Server) => {
  // 登录
  server.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body

      const user = await User.findOne({
        where: { username },
      })

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.send(401, { error: 'Invalid credentials' })
        return
      }

      const token = jwt.sign(
        { id: user.uuid },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      )

      res.send({
        token,
        userInfo: {
          name: user.name,
          avatar: user.avatar,
        },
      })
      return
    } catch (err) {
      res.send(500, { error: 'Internal server error' })
      return
    }
  })

  // 获取用户信息
  server.get('/api/auth/profile', authMiddleware, async (req, res) => {
    const user = (req as any).user
    res.send({
      name: user.name,
      avatar: user.avatar,
    })
    return
  })

  // 退出登录
  server.post('/api/auth/logout', authMiddleware, async (req, res) => {
    // 由于使用的是 JWT，服务器端不需要特殊处理
    // 客户端会自行清除 token
    res.send(204)
    return
  })
}
