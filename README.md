# Smart ToDo API

A RESTful API for managing todo tasks with user authentication, built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 JWT-based user authentication
- 👤 User registration and login
- 📝 Full CRUD operations for tasks
- 🔒 User-specific task access (users can only see/modify their own tasks)
- ✅ Input validation
- 🛡️ Secure password hashing with bcrypt
- 📚 API documentation

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-ToDo-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (copy from `env.example`):
```bash
# On Unix/Linux/Mac:
cp .env.example .env

# On Windows (PowerShell):
Copy-Item env.example .env

# Or manually create .env file with the content from env.example
```

4. Update `.env` with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-todo
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

5. Start MongoDB (if using local MongoDB):
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

6. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Documentation

### Interactive Documentation

**Swagger UI** (if installed):
- Visit: `http://localhost:3000/api-docs/swagger`
- Interactive API documentation with "Try it out" feature

**Basic Documentation**:
- Visit: `http://localhost:3000/api-docs`
- Quick reference of all endpoints

**Postman Collection**:
- Import `postman-collection.json` into Postman
- Includes all endpoints with example requests
- Automatically saves JWT tokens after login/register

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "Johndoe12",
  "email": "john@gmail.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRjM2Y4ZGYyMzM4YzY0ZDFjMDJlYmQiLCJpYXQiOjE3NjY2MDQ2ODUsImV4cCI6MTc2NzIwOTQ4NX0.wyOqOpEsK_Gq_J0xhOC2_h2f2nwU71ONDXV65Wi1jeQ",
  "user": {
    "id": "694c3f8df2338c64d1c02ebd",
    "username": "Johndoe12",
    "email": "john@gmail.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@gmail.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRjM2Y4ZGYyMzM4YzY0ZDFjMDJlYmQiLCJpYXQiOjE3NjY2MDQ4MzQsImV4cCI6MTc2NzIwOTYzNH0.vqZe2eP2aa45ubfoS-43YYQ1yABYtsgMDsgOBGuN2UQ",
  "user": {
    "id": "694c3f8df2338c64d1c02ebd",
    "username": "Johndoe12",
    "email": "john@gmail.com"
  }
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:

#### Create a Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the Smart ToDo API project",
  "completed": false
}
```

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project",
    "description": "Finish the Smart ToDo API project",
    "completed": false,
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Tasks retrieved successfully",
  "count": 2,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project",
      "description": "Finish the Smart ToDo API project",
      "completed": false,
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Update a Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated task title",
    "description": "Finish the Smart ToDo API project",
    "completed": true,
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Delete a Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project",
    "description": "Finish the Smart ToDo API project",
    "completed": false,
    "user": "507f1f77bcf86cd799439011"
  }
}
```

### Health Check
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "Smart ToDo API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Responses

The API returns standardized error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Testing with Postman

1. Import the API collection (see Postman section below)
2. Set up environment variables in Postman:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set automatically after login)

3. Test flow:
   - Register a new user
   - Login (token will be saved automatically)
   - Create tasks
   - Get all tasks
   - Update a task
   - Delete a task

## Project Structure

```
smart-ToDo-app/
├── models/           # Mongoose models
│   ├── User.js      # User model
│   └── Task.js      # Task model
├── routes/          # Express routes
│   ├── auth.js      # Authentication routes
│   ├── tasks.js     # Task routes
│   └── swagger.js   # Swagger documentation route
├── middleware/      # Express middleware
│   ├── auth.js      # JWT authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── server.js        # Main server file
├── package.json     # Dependencies
├── env.example      # Environment variables template
├── postman-collection.json  # Postman collection for API testing
├── .gitignore       # Git ignore file
└── README.md        # This file
```

## Security Best Practices

1. **Change JWT_SECRET**: Always use a strong, random secret in production
2. **Use HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files to version control
4. **Password Strength**: Implement stronger password requirements in production
5. **Rate Limiting**: Consider adding rate limiting to prevent abuse
6. **CORS**: Configure CORS properly for your frontend domain

## MongoDB Connection

### MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/%20Notes/smart-todo
```

## License

ISC

## Author

Smart ToDo API Team



