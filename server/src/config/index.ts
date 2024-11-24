import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

interface DatabaseConfig {
  dialect: 'mariadb'
  host: string
  port: number
  username: string
  password: string
  database: string
  logging: boolean | ((sql: string) => void)
}

interface Config {
  server: {
    port: number
    env: string
  }
  database: DatabaseConfig
  jwt: {
    secret: string
    expiresIn: string
  }
}

function loadConfig(): Config {
  const configPath = path.resolve(process.cwd(), 'config.yml')
  const fileContents = fs.readFileSync(configPath, 'utf8')
  const config = yaml.load(fileContents) as Config

  // 环境变量覆盖
  return {
    server: {
      port: Number(process.env.PORT) || config.server.port,
      env: process.env.NODE_ENV || config.server.env,
    },
    database: {
      ...config.database,
      host: process.env.DB_HOST || config.database.host,
      port: Number(process.env.DB_PORT) || config.database.port,
      username: process.env.DB_USER || config.database.username,
      password: process.env.DB_PASSWORD || config.database.password,
      database: process.env.DB_NAME || config.database.database,
      logging:
        process.env.NODE_ENV === 'development'
          ? console.log
          : config.database.logging,
    },
    jwt: {
      secret: process.env.JWT_SECRET || config.jwt.secret,
      expiresIn: process.env.JWT_EXPIRES_IN || config.jwt.expiresIn,
    },
  }
}

const config = loadConfig()
export default config
