/**
 * Task Model
 * Defines the schema for task documents in MongoDB
 */

const mongoose = require('mongoose');

// Task Schema - defines the structure of task documents
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Task description cannot exceed 1000 characters'],
    default: '' // Optional field, defaults to empty string
  },
  completed: {
    type: Boolean,
    default: false // Tasks are incomplete by default
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User document
    ref: 'User', // Model name to reference
    required: [true, 'Task must belong to a user'],
    index: true // Index for faster queries (finding tasks by user)
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

