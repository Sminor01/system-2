const express = require('express');
const router = express.Router();
const TimeEntryController = require('../controllers/timeEntryController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all time entries
router.get('/', TimeEntryController.getAll);

// Get time entry by ID
router.get('/:id', TimeEntryController.getById);

// Create new time entry
router.post('/', TimeEntryController.create);

// Update time entry
router.put('/:id', TimeEntryController.update);

// Delete time entry
router.delete('/:id', TimeEntryController.delete);

// Stop timer for time entry
router.post('/:id/stop', TimeEntryController.stopTimer);

module.exports = router; 