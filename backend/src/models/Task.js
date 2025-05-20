const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  complexityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'complexity_id',
    references: {
      model: 'task_complexities',
      key: 'id'
    }
  },
  priorityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'priority_id',
    references: {
      model: 'task_priorities',
      key: 'id'
    }
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'status_id',
    references: {
      model: 'task_statuses',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'start_date'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  timeSpent: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'time_spent'
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'assigned_to_id',
    references: {
      model: 'workers',
      key: 'id'
    }
  },
  responsibleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'responsible_id',
    references: {
      model: 'workers',
      key: 'id'
    }
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by_id',
    references: {
      model: 'user_profiles',
      key: 'id'
    }
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['status_id']
    },
    {
      fields: ['priority_id']
    },
    {
      fields: ['complexity_id']
    },
    {
      fields: ['assigned_to_id']
    },
    {
      fields: ['responsible_id']
    }
  ]
});

module.exports = Task; 