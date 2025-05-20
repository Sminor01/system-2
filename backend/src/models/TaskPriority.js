const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskPriority = sequelize.define('TaskPriority', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#000000'
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'order_index'
  }
}, {
  tableName: 'task_priorities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TaskPriority; 