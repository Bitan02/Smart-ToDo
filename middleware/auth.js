/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and attaches user information to request
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication Middleware
 * This middleware:
 * 1. Reads the JWT token from the Authorization header
 * 2. Verifies the token is valid
 * 3. Attaches the user ID to req.user
 * 4. Returns 401 error if token is missing or invalid
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided. Please include a Bearer token in the Authorization header.'
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Check if user still exists (user might have been deleted)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User no longer exists'
      });
    }

    // Attach user ID to request object for use in route handlers
    req.user = {
      userId: decoded.userId,
      user // Attach full user object if needed
    };

    // Call next middleware or route handler
    next();
  } catch (error) {
    // Pass any unexpected errors to error handling middleware
    next(error);
  }
};

module.exports = authenticate;

