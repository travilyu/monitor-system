import { Sequelize } from 'sequelize'
import { initUserModel } from './user'
import { initLineModel } from './line'
import { initAnalysisModel } from './analysis'
import { initSliceModel } from './slice'
import config from '../config'

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
})
Analysis.belongsTo(Line, {
  foreignKey: 'lineUuid',
  targetKey: 'uuid',
})

export { sequelize }
