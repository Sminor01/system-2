const { TaskStatus } = require('../models');

const taskStatuses = [
  {
    name: 'New',
    description: 'Newly created task',
    color: '#1976d2',
    orderIndex: 1
  },
  {
    name: 'Analysis',
    description: 'Task is under analysis',
    color: '#9c27b0',
    orderIndex: 2
  },
  {
    name: 'In Development',
    description: 'Task is being developed',
    color: '#f57c00',
    orderIndex: 3
  },
  {
    name: 'Review',
    description: 'Task is under review',
    color: '#2196f3',
    orderIndex: 4
  },
  {
    name: 'Under Revision',
    description: 'Task needs revision',
    color: '#ff9800',
    orderIndex: 5
  },
  {
    name: 'Rollout',
    description: 'Task is being rolled out',
    color: '#4caf50',
    orderIndex: 6
  },
  {
    name: 'Other Direction',
    description: 'Task is redirected to another direction',
    color: '#607d8b',
    orderIndex: 7
  },
  {
    name: 'Completed',
    description: 'Task is completed',
    color: '#388e3c',
    orderIndex: 8
  }
];

async function seedTaskStatuses() {
  try {
    console.log('Seeding task statuses...');
    
    for (const status of taskStatuses) {
      await TaskStatus.findOrCreate({
        where: { name: status.name },
        defaults: status
      });
    }
    
    console.log('Task statuses seeded successfully!');
  } catch (error) {
    console.error('Error seeding task statuses:', error);
  }
}

module.exports = seedTaskStatuses;

// If this script is run directly
if (require.main === module) {
  const sequelize = require('../config/database');
  
  sequelize.sync()
    .then(() => seedTaskStatuses())
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
} 