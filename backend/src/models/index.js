const UserProfile = require('./UserProfile');
const Task = require('./Task');
const TimeEntry = require('./TimeEntry');
const Worker = require('./Worker');
const TaskStatus = require('./TaskStatus');
const TaskPriority = require('./TaskPriority');
const TaskComplexity = require('./TaskComplexity');
const Department = require('./Department');
const Position = require('./Position');

// User Profile relationships
UserProfile.hasMany(Task, { foreignKey: 'createdById', as: 'createdTasks' });
UserProfile.hasMany(TimeEntry, { foreignKey: 'userProfileId', as: 'timeEntries' });
UserProfile.hasOne(Worker, { foreignKey: 'userProfileId', as: 'workerProfile' });

// Worker relationships
Worker.belongsTo(UserProfile, { foreignKey: 'userProfileId', as: 'userProfile' });
Worker.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Worker.belongsTo(Position, { foreignKey: 'positionId', as: 'position' });
Worker.hasMany(Task, { foreignKey: 'assignedToId', as: 'assignedTasks' });
Worker.hasMany(Task, { foreignKey: 'responsibleId', as: 'responsibleTasks' });

// Department relationships
Department.hasMany(Position, { foreignKey: 'departmentId', as: 'positions' });
Department.hasMany(Worker, { foreignKey: 'departmentId', as: 'workers' });

// Position relationships
Position.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Position.hasMany(Worker, { foreignKey: 'positionId', as: 'workers' });

// Task relationships
Task.belongsTo(UserProfile, { foreignKey: 'createdById', as: 'creator' });
Task.belongsTo(Worker, { foreignKey: 'assignedToId', as: 'assignedTo' });
Task.belongsTo(Worker, { foreignKey: 'responsibleId', as: 'responsible' });
Task.belongsTo(TaskStatus, { foreignKey: 'statusId', as: 'status' });
Task.belongsTo(TaskPriority, { foreignKey: 'priorityId', as: 'priority' });
Task.belongsTo(TaskComplexity, { foreignKey: 'complexityId', as: 'complexity' });
Task.hasMany(TimeEntry, { foreignKey: 'taskId', as: 'timeEntries' });

// Task Status relationships
TaskStatus.hasMany(Task, { foreignKey: 'statusId', as: 'tasks' });

// Task Priority relationships
TaskPriority.hasMany(Task, { foreignKey: 'priorityId', as: 'tasks' });

// Task Complexity relationships
TaskComplexity.hasMany(Task, { foreignKey: 'complexityId', as: 'tasks' });

// Time Entry relationships
TimeEntry.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
TimeEntry.belongsTo(UserProfile, { foreignKey: 'userProfileId', as: 'user' });

module.exports = {
  UserProfile,
  Task,
  TimeEntry,
  Worker,
  TaskStatus,
  TaskPriority,
  TaskComplexity,
  Department,
  Position
}; 