const sequelize = require('../config/database');
const { 
  UserProfile, 
  Task, 
  TimeEntry, 
  Worker, 
  TaskStatus,
  TaskPriority,
  TaskComplexity,
  Department,
  Position 
} = require('../models');
const seedInitialData = require('./seedInitialData');

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models with database
    // force: false - не пересоздавать таблицы, если они уже существуют
    await sequelize.sync({ force: false });
    console.log('Database models synchronized successfully.');

    // Seed initial data
    await seedInitialData();
    console.log('Initial data seeded successfully.');

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initDatabase; 