/**
 * Task Routes
 * Handles CRUD operations for tasks
 * All routes are protected and user-specific
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authenticate = require('../middleware/auth'); // Import auth middleware

const router = express.Router();

// All routes in this file require authentication
// Apply the authenticate middleware to all routes
router.use(authenticate);

/**
 * POST /api/tasks
 * Create a new task
 */
router.post(
  '/',
  [
    // Validation middleware
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ max: 200 })
      .withMessage('Task title cannot exceed 200 characters'),
    
    body('description')
      .optional() // Description is optional
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Task description cannot exceed 1000 characters'),
    
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean value')
  ],
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { title, description, completed } = req.body;

      // Create new task with user ID from authenticated request
      const task = new Task({
        title,
        description: description || '',
        completed: completed || false,
        user: req.user.userId // Set user from authenticated request
      });

      await task.save();

      // Populate user field to return user info (optional, can be removed)
      await task.populate('user', 'username email');

      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req, res, next) => {
  try {
    // Find all tasks belonging to the authenticated user
    // Only return tasks where user ID matches the authenticated user's ID
    const tasks = await Task.find({ user: req.user.userId })
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put(
  '/:id',
  [
    // Validation middleware
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Task title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Task title cannot exceed 200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Task description cannot exceed 1000 characters'),
    
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean value')
  ],
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const { title, description, completed } = req.body;

      // Find task by ID AND ensure it belongs to the authenticated user
      const task = await Task.findOne({ _id: id, user: req.user.userId });

      if (!task) {
        return res.status(404).json({
          error: 'Task not found',
          message: 'Task does not exist or you do not have permission to access it'
        });
      }

      // Update task fields (only update fields that are provided)
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (completed !== undefined) task.completed = completed;

      await task.save();

      res.status(200).json({
        message: 'Task updated successfully',
        task
      });
    } catch (error) {
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Invalid task ID',
          message: 'The provided task ID is not valid'
        });
      }
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete task by ID AND ensure it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'Task does not exist or you do not have permission to delete it'
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid task ID',
        message: 'The provided task ID is not valid'
      });
    }
    next(error);
  }
});

module.exports = router;

