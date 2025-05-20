const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskStatus = sequelize.define('TaskStatus', {
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
    type: DataTypes.STRING(200),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7), // Hex color code
    allowNull: true,
    defaultValue: '#000000'
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'task_statuses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TaskStatus; 