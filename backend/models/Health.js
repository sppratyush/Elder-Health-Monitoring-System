const mongoose = require("mongoose");

// Define the blueprint for Health records in the database
const healthSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
  },
  oxygen: {
    type: Number,
    required: true,
  },
  systolic: {
    type: Number,
    required: true,
  },
  diastolic: {
    type: Number,
    required: true,
  },
  alert: {
    type: String,
    enum: ["Critical", "Warning", "Heart Rate Alert", "Normal"],
    default: "Normal", // If no issue is found, it's considered Normal
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically saves the current date/time
  },
});

// Create and export the Health model
module.exports = mongoose.model("Health", healthSchema);
