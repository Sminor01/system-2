const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Task metadata
router.get('/statuses', TaskController.getMetadata);
router.get('/priorities', TaskController.getMetadata);
router.get('/complexities', TaskController.getMetadata);

// Task CRUD operations
router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

// Task status update
router.patch('/:id/status', TaskController.updateStatus);

module.exports = router; 