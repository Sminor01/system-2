const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
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
} = require('./models');
const seedInitialData = require('./scripts/seedInitialData');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const timeEntryRoutes = require('./routes/timeEntries');
const workerRoutes = require('./routes/workers');
const departmentRoutes = require('./routes/departments');
const positionRoutes = require('./routes/positions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);

// Database initialization
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ force: true }); // Use force: true to recreate all tables
    console.log('Database models synchronized successfully.');

    // Seed initial data
    await seedInitialData();
    console.log('Initial data seeded successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server is running on port ${PORT}`);
}); 