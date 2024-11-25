import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

export class Analysis extends Model<
  InferAttributes<Analysis>,
  InferCreationAttributes<Analysis>
> {
  declare id: CreationOptional<number>
  declare uuid: string
  declare name: string
  declare testType: 'ICMP-ECHO'
  declare probeCount: number
  declare interval: number
  declare maxRetries: number
  declare timeout: number
  declare jitterThreshold: number
  declare lossThreshold: number
  declare delayThreshold: number
  declare ipType: 'IPv4' | 'domain'
  declare destIp: string
  declare nextHopAddress: string
  declare sourceIp: string
  declare lineUuid: string
  declare status: 'active' | 'inactive'
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export function initAnalysisModel(sequelize: Sequelize) {
  Analysis.init(
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
      testType: {
        type: DataTypes.ENUM('ICMP-ECHO'),
        allowNull: false,
      },
      probeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 10,
          max: 1024,
        },
      },
      interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 100,
          max: 6000,
        },
      },
      maxRetries: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeout: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jitterThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lossThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delayThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ipType: {
        type: DataTypes.ENUM('IPv4', 'domain'),
        allowNull: false,
      },
      destIp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nextHopAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sourceIp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lineUuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'lines',
          key: 'uuid',
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'inactive',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'analysis_tasks',
    }
  )

  return Analysis
}
