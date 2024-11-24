import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

export class Line extends Model<
  InferAttributes<Line>,
  InferCreationAttributes<Line>
> {
  declare id: CreationOptional<number>
  declare uuid: string
  declare name: string
  declare description: string
  declare vlan: number
  declare bandwidth: number

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
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
