const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeEntry = sequelize.define('TimeEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'task_id',
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  userProfileId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_profile_id',
    references: {
      model: 'user_profiles',
      key: 'id'
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'end_time'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'time_entries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['task_id']
    },
    {
      fields: ['user_profile_id']
    }
  ]
});

module.exports = TimeEntry; 