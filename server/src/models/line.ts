import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasMany,
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
  declare status: CreationOptional<'success' | 'warning' | 'error' | null>

  // 声明关联
  declare Analysis?: Analysis

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // 声明关联方法
  declare static associations: {
    Analysis: HasMany<Line, Analysis>
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
      status: {
        type: DataTypes.ENUM('success', 'warning', 'error'),
        allowNull: true,
        defaultValue: null,
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
