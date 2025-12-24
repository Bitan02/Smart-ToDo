/**
 * Swagger API Documentation Route
 * Provides interactive API documentation using Swagger UI
 */

const express = require('express');
const router = express.Router();

// Swagger JSDoc and Swagger UI setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart ToDo API',
      version: '1.0.0',
      description: 'A RESTful API for managing todo tasks with JWT authentication',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'] // Paths to files containing OpenAPI definitions
};

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Smart ToDo API Documentation'
}));

module.exports = router;

