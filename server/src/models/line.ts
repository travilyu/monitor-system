import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasMany,
  QueryTypes,
} from 'sequelize'
import { Analysis } from './analysis'

export class Line extends Model<
  InferAttributes<Line, { omit: 'Analysis' }>,
  InferCreationAttributes<Line, { omit: 'Analysis' }>
> {
  declare id: CreationOptional<number>
  declare uuid: string
  declare name: string
  declare description: string
  declare vlan: number
  declare bandwidth: number

  // 声明关联
  declare Analysis?: Analysis

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // 声明关联方法
  declare static associations: {
    Analysis: HasMany<Line, Analysis>
  }
}

export async function checkAndRemoveStatusField(sequelize: Sequelize) {
  try {
    // 检查 status 字段是否存在
    const [results] = await sequelize.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = 'lines'
       AND COLUMN_NAME = 'status'`,
      { type: QueryTypes.SELECT }
    )

    if (results) {
      console.log('Found deprecated status field, removing...')
      // 删除 status 字段
      await sequelize.query('ALTER TABLE `lines` DROP COLUMN status')
      console.log('Status field removed successfully')
    } else {
      console.log('Status field not found, no action needed')
    }
  } catch (error) {
    console.error('Error checking/removing status field:', error)
  }
}

export function initLineModel(sequelize: Sequelize) {
  Line.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vlan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bandwidth: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'lines',
    }
  )

  return Line
}
