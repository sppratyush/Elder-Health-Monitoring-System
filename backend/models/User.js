const mongoose = require("mongoose");

// Define the blueprint for a User in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["CareManager", "Parent", "Child"], // Only these 3 roles are allowed
    required: true,
  },
});

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
