import { Sequelize } from 'sequelize'
import { initUserModel } from './user'
import { initLineModel } from './line'
import config from '../config'

const sequelize = new Sequelize(config.database)

// 初始化模型
export const User = initUserModel(sequelize)
export const Line = initLineModel(sequelize)

export { sequelize }
