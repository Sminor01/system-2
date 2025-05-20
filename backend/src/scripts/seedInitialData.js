const { TaskStatus, TaskPriority, TaskComplexity, Department, Position } = require('../models');

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

const taskPriorities = [
  {
    name: 'Low',
    description: 'Low priority task',
    color: '#4caf50',
    orderIndex: 1
  },
  {
    name: 'Medium',
    description: 'Medium priority task',
    color: '#ff9800',
    orderIndex: 2
  },
  {
    name: 'High',
    description: 'High priority task',
    color: '#f44336',
    orderIndex: 3
  },
  {
    name: 'Critical',
    description: 'Critical priority task',
    color: '#d32f2f',
    orderIndex: 4
  }
];

const taskComplexities = [
  {
    name: 'Simple',
    description: 'Simple task that can be completed quickly',
    color: '#4caf50',
    orderIndex: 1
  },
  {
    name: 'Moderate',
    description: 'Moderately complex task',
    color: '#ff9800',
    orderIndex: 2
  },
  {
    name: 'Complex',
    description: 'Complex task requiring significant effort',
    color: '#f57c00',
    orderIndex: 3
  },
  {
    name: 'Very Complex',
    description: 'Very complex task requiring extensive effort',
    color: '#f44336',
    orderIndex: 4
  }
];

const departments = [
  {
    name: 'Development',
    description: 'Software Development Department'
  },
  {
    name: 'QA',
    description: 'Quality Assurance Department'
  },
  {
    name: 'Design',
    description: 'UI/UX Design Department'
  },
  {
    name: 'Project Management',
    description: 'Project Management Department'
  }
];

const positions = [
  {
    name: 'Junior Developer',
    description: 'Junior Software Developer',
    departmentId: 1
  },
  {
    name: 'Senior Developer',
    description: 'Senior Software Developer',
    departmentId: 1
  },
  {
    name: 'QA Engineer',
    description: 'Quality Assurance Engineer',
    departmentId: 2
  },
  {
    name: 'UI/UX Designer',
    description: 'User Interface/Experience Designer',
    departmentId: 3
  },
  {
    name: 'Project Manager',
    description: 'Project Manager',
    departmentId: 4
  }
];

async function seedInitialData() {
  try {
    console.log('Seeding initial data...');

    // Seed task statuses
    console.log('Seeding task statuses...');
    for (const status of taskStatuses) {
      await TaskStatus.findOrCreate({
        where: { name: status.name },
        defaults: status
      });
    }

    // Seed task priorities
    console.log('Seeding task priorities...');
    for (const priority of taskPriorities) {
      await TaskPriority.findOrCreate({
        where: { name: priority.name },
        defaults: priority
      });
    }

    // Seed task complexities
    console.log('Seeding task complexities...');
    for (const complexity of taskComplexities) {
      await TaskComplexity.findOrCreate({
        where: { name: complexity.name },
        defaults: complexity
      });
    }

    // Seed departments
    console.log('Seeding departments...');
    for (const department of departments) {
      await Department.findOrCreate({
        where: { name: department.name },
        defaults: department
      });
    }

    // Seed positions
    console.log('Seeding positions...');
    for (const position of positions) {
      await Position.findOrCreate({
        where: { name: position.name },
        defaults: position
      });
    }

    console.log('Initial data seeded successfully!');
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
}

module.exports = seedInitialData; 