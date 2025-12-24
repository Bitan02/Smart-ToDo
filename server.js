/**
 * Smart ToDo API - Main Server File
 * This file sets up and starts the Express server
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
// CORS - allows cross-origin requests (useful for frontend integration)
app.use(cors());

// Body parser - allows us to read JSON from request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-todo';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the process if database connection fails
  });

// Health check route (useful for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Smart ToDo API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // Protected routes will be handled by auth middleware

// API Documentation route (basic)
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login and get JWT token'
      },
      tasks: {
        'POST /api/tasks': 'Create a new task (requires authentication)',
        'GET /api/tasks': 'Get all tasks for authenticated user (requires authentication)',
        'PUT /api/tasks/:id': 'Update a task (requires authentication)',
        'DELETE /api/tasks/:id': 'Delete a task (requires authentication)'
      }
    },
    swagger: 'Visit /api-docs/swagger for interactive Swagger documentation',
    postman: 'See postman-collection.json for Postman collection'
  });
});

// Swagger API Documentation (optional - requires swagger packages)
try {
  const swaggerRoutes = require('./routes/swagger');
  app.use('/api-docs/swagger', swaggerRoutes);
} catch (error) {
  console.log('⚠️  Swagger documentation not available. Run "npm install" to enable.');
}

// 404 handler - catches all routes that don't match
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;

