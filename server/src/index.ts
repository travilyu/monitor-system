import * as restify from 'restify'
import * as dotenv from 'dotenv'
import { initDatabase } from './db'
import { setupAuthRoutes } from './auth'
import { setupLineRoutes } from './lines'
import { setupAnalysisRoutes } from './analysis'

dotenv.config()

const server = restify.createServer()

// 中间件
server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser())

// CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type,Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  next()
})

// 处理 OPTIONS 请求
server.opts('/*', (req, res, next) => {
  res.send(204)
  return next()
})

// 设置路由
setupAuthRoutes(server)
setupLineRoutes(server)
setupAnalysisRoutes(server)

// 初始化数据库并启动服务器
async function start() {
  try {
    await initDatabase()

    const port = process.env.PORT || 3000
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()