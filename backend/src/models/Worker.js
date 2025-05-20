const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name'
  },
  secondName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'second_name'
  },
  positionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'position_id',
    references: {
      model: 'positions',
      key: 'id'
    }
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'department_id',
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  userProfileId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_profile_id',
    references: {
      model: 'user_profiles',
      key: 'id'
    }
  }
}, {
  tableName: 'workers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['last_name', 'first_name']
    },
    {
      fields: ['department_id']
    },
    {
      fields: ['position_id']
    }
  ]
});

module.exports = Worker; 