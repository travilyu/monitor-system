import { Sequelize } from 'sequelize'
import config from '../config'
import { initLineModel, checkAndRemoveStatusField } from './line'
import { initAnalysisModel } from './analysis'
import { initSliceModel } from './slice'
import { initUserModel } from './user'

const sequelize = new Sequelize(config.database)

// 初始化模型
export const User = initUserModel(sequelize)
export const Line = initLineModel(sequelize)
export const Analysis = initAnalysisModel(sequelize)
export const Slice = initSliceModel(sequelize)

// 设置关联关系
Line.hasMany(Analysis, {
  foreignKey: 'lineUuid',
  sourceKey: 'uuid',
  as: 'Analysis',
})

Analysis.belongsTo(Line, {
  foreignKey: 'lineUuid',
  targetKey: 'uuid',
})

// 数据库迁移
export async function runMigrations() {
  try {
    console.log('Running database migrations...')
    await checkAndRemoveStatusField(sequelize)
    console.log('Database migrations completed')
  } catch (error) {
    console.error('Error running migrations:', error)
  }
}

export { sequelize }
