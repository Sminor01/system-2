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

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Drop all tables and recreate them
    // force: true - пересоздать все таблицы
    await sequelize.sync({ force: true });
    console.log('Database tables dropped and recreated successfully.');

    // Seed initial data
    await seedInitialData();
    console.log('Initial data seeded successfully.');

    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  // Ask for confirmation before resetting
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('WARNING: This will delete all data in the database. Are you sure? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      try {
        await resetDatabase();
        console.log('Database reset completed successfully!');
      } catch (error) {
        console.error('Database reset failed:', error);
      }
    } else {
      console.log('Database reset cancelled.');
    }
    readline.close();
    process.exit(0);
  });
}

module.exports = resetDatabase; 