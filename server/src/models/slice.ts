import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

export class Slice extends Model<
  InferAttributes<Slice>,
  InferCreationAttributes<Slice>
> {
  declare id: CreationOptional<number>
  declare uuid: string
  declare name: string
  declare description: string
  declare identifyType: 'IP_TUPLE' | 'APPLICATION'
  declare applications: string[]
  declare sourceIpPort: string
  declare protocol: string
  declare destIpPort: string
  declare bandwidth: number
  declare priority: number
  declare lineUuids: string[]
  declare nextHop: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export function initSliceModel(sequelize: Sequelize) {
  Slice.init(
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
      identifyType: {
        type: DataTypes.ENUM('IP_TUPLE', 'APPLICATION'),
        allowNull: false,
        defaultValue: 'IP_TUPLE',
      },
      applications: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      sourceIpPort: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      protocol: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'TCP',
      },
      destIpPort: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bandwidth: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 100,
        },
      },
      lineUuids: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      nextHop: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'slices',
    }
  )

  return Slice
}
