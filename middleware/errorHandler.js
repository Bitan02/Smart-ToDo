/**
 * Error Handling Middleware
 * Centralized error handling for the entire application
 * This middleware catches all errors and formats them properly
 */

/**
 * Global Error Handler Middleware
 * Must be placed after all routes in server.js
 */
const errorHandler = (err, req, res, next) => {
  // Default error object
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (in production, you might want to use a logging service)
  console.error('Error:', err);

  // Mongoose bad ObjectId (invalid MongoDB ID format)
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error (e.g., duplicate email or username)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development
  });
};

module.exports = errorHandler;

