import { Sequelize } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import { User, Line } from './models'
import config from './config'

// 删除这里的 sequelize 实例创建，因为已经在 models/index.ts 中创建了
// 直接从 models 中导入
import { sequelize } from './models'

export async function initDatabase() {
  try {
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    // 同步数据库结构
    await sequelize.sync({ alter: config.server.env === 'development' })
    console.log('Database synchronized')

    // 检查是否需要创建管理员账户
    const adminExists = await User.findOne({
      where: { username: 'admin' },
    })

    if (!adminExists) {
      // 创建管理员账户
      await User.create({
        uuid: uuidv4(),
        username: 'admin',
        password: 'admin123', // 通过模型的 setter 自动加密
        name: '系统管理员',
        role: 'admin',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
      })
      console.log('Admin account created')
    }

    // 在开发环境下创建测试用户和测试线路
    if (config.server.env === 'development') {
      const testUserExists = await User.findOne({
        where: { username: 'test' },
      })

      if (!testUserExists) {
        await User.create({
          uuid: uuidv4(),
          username: 'test',
          password: 'test123',
          name: '测试用户',
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=test`,
        })
        console.log('Test account created')
      }

      // 创建测试线路数据
      const lineCount = await Line.count()
      if (lineCount === 0) {
        const testLines = Array(10)
          .fill(0)
          .map((_, index) => ({
            uuid: uuidv4(),
            name: `线路 ${index + 1}`,
            description: `这是第 ${index + 1} 条线路的描述`,
            vlan: 100 + index,
            bandwidth: 1000000000 + index * 100000000, // 1Gbps 起步
          }))

        await Line.bulkCreate(testLines)
        console.log('Test lines created')
      }
    }
  } catch (error) {
    console.error('Unable to initialize database:', error)
    throw error
  }
}

export { sequelize }
