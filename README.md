# Network Monitor System

网络监控系统，包含前端 UI 和后端 Server。

## 启动说明

### UI 启动

1. 进入 ui 目录：

```bash
cd ui
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 构建生产版本：

```bash
npm run build
```

### Server 启动

1. 进入 server 目录：

```bash
cd server
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 构建生产版本：

```bash
npm run build
npm start
```

## UI 配置说明

### 线路颜色配置

线路状态颜色在 `ui/src/components/business/StatisticCard/index.vue` 中配置：

```typescript
const statusColors = {
  success: '#52c41a', // 正常状态 - 绿色
  warning: '#faad14', // 警告状态 - 黄色
  error: '#ff4d4f', // 错误状态 - 红色
}
```

### 折线图配置

折线图颜色在 `ui/src/views/business/line/Monitor.vue` 中配置：

```typescript
// 吞吐量 - 固定蓝色
{
  title: '吞吐量',
  color: '#1890ff'
}

// 延迟 - 根据数值动态变化
const getLatencyColor = (value: number) => {
  if (value <= 20) return '#52c41a'  // 绿色，20ms以下
  if (value <= 50) return '#faad14'  // 黄色，20-50ms
  return '#ff4d4f'                   // 红色，50ms以上
}

// 丢包率 - 根据数值动态变化
const getPacketLossColor = (value: number) => {
  if (value <= 1) return '#52c41a'   // 绿色，1%以下
  if (value <= 3) return '#faad14'   // 黄色，1-3%
  return '#ff4d4f'                   // 红色，3%以上
}

// 抖动 - 简单阈值判断
{
  title: '抖动',
  color: (value: number) => (value <= 5 ? '#52c41a' : '#ff4d4f')  // 5ms为阈值
}
```

折线图颜色说明：

- 吞吐量：固定使用蓝色
- 延迟：根据延迟值动态变化（绿色 ≤20ms，黄色 ≤50ms，红色>50ms）
- 丢包率：根据丢包率动态变化（绿色 ≤1%，黄色 ≤3%，红色>3%）
- 抖动：根据是否超过 5ms 阈值显示绿色或红色

可以根据需要调整这些颜色值来改变图表的显示效果。

## Server 配置说明

### 数据库配置

在 `server/config.yml` 中配置数据库连接：

```yaml
database:
  dialect: mariadb
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: network_monitor
  logging: true # 开发环境建议开启，生产环境关闭
```

### Prometheus 配置

1. 基础配置

在 `server/config.yml` 中配置 Prometheus 连接：

```yaml
prometheus:
  url: 'http://localhost:9090'
  auth:
    username: 'prometheus' # 如果需要 Basic 认证
    password: 'your-password'
    token: 'your-token' # 如果使用 Bearer Token 认证
```

注意：token 和 username/password 同时存在时，优先使用 token。

2. 查询配置

在 `server/config/prometheus-queries.yml` 中配置监控指标的查询语句：

```yaml
metrics:
  throughput:
    query: 'rate(interface_bytes_total{line_id="{{lineId}}"}[5m]) * 8'
    description: '线路吞吐量 (bps)'

  latency:
    query: 'avg_over_time(ping_latency_ms{line_id="{{lineId}}"}[5m])'
    description: '线路延迟 (ms)'
```

查询语句中的 `{{lineId}}` 会被自动替换为实际的线路 ID。

## 开发说明

### 带宽单位

- 前端显示：Mbps
- 后端存储：bps
- 自动转换：前端 API 层自动处理单位转换

### 监控数据

- 来源：Prometheus
- 备选：当 Prometheus 不可用时，使用模拟数据
- 时间范围：默认 24 小时
- 采样间隔：默认 5 分钟
