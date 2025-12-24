/**
 * User Model
 * Defines the schema for user documents in MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema - defines the structure of user documents
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'], // Required field with custom error message
    unique: true, // Username must be unique
    trim: true, // Removes whitespace from both ends
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Email must be unique
    lowercase: true, // Convert email to lowercase
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Email regex pattern
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default (for security)
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Pre-save hook - runs before saving a user document
// This hashes the password before saving it to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt for password hashing (10 rounds is a good balance)
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method - compares plain text password with hashed password
// This can be called on any user instance: user.comparePassword('plainPassword')
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;

