const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8080

// 静态文件服务
app.use(express.static(path.join(__dirname, 'ui/dist')))

// API 代理
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
  })
)

// 所有其他请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(
    `Static files are served from: ${path.join(__dirname, 'ui/dist')}`
  )
  console.log('API requests are proxied to: http://localhost:3000')
})
