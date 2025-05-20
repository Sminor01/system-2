const express = require('express');
const router = express.Router();
const WorkerController = require('../controllers/workerController');
const { authMiddleware } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Worker CRUD operations
router.get('/', WorkerController.getAll);
router.get('/:id', WorkerController.getById);
router.post('/', WorkerController.create);
router.put('/:id', WorkerController.update);
router.delete('/:id', WorkerController.delete);

module.exports = router; 