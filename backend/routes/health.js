const express = require("express");
const Health = require("../models/Health");
const { verifyToken, isCareManager } = require("../middleware/auth");

const router = express.Router();

// Helper function to decide what alert to generate based on health metrics
const determineAlert = (hr, oxygen, sys, dia) => {
  if (oxygen < 92) return "Critical"; // Low oxygen is highest priority
  if (sys > 140 || dia > 90) return "Warning"; // High blood pressure is a warning
  if (hr < 50 || hr > 110) return "Heart Rate Alert"; // Abnormal heart rate
  return "Normal"; // Everything looks fine
};

// @route POST /api/health
// @desc  Add new health data (Only CareManagers can do this)
router.post("/", verifyToken, isCareManager, async (req, res) => {
  try {
    const { patientId, heartRate, oxygen, systolic, diastolic } = req.body;

    // Check what the alert level should be before saving
    const generatedAlert = determineAlert(heartRate, oxygen, systolic, diastolic);

    // Create a new health record
    const newRecord = new Health({
      patientId,
      heartRate,
      oxygen,
      systolic,
      diastolic,
      alert: generatedAlert,
    });

    await newRecord.save();
    res.status(201).json({ msg: "Health data saved successfully!", alert: generatedAlert });
  } catch (err) {
    console.error("Save Health Error:", err);
    res.status(500).json({ msg: "Server error saving health data" });
  }
});

// @route GET /api/health/alerts
// @desc  Fetch all records that triggered an alert (not Normal)
router.get("/alerts", verifyToken, async (req, res) => {
  try {
    // Find all health data where the 'alert' field is strictly NOT equal ($ne) to 'Normal'
    const alerts = await Health.find({ alert: { $ne: "Normal" } }).sort({ createdAt: -1 }); // Sort by newest first
    res.json(alerts);
  } catch (err) {
    console.error("Get Alerts Error:", err);
    res.status(500).json({ msg: "Server error retrieving alerts" });
  }
});

// @route GET /api/patient/:id
// @desc  Fetch the entire health history for a specific patient
router.get("/patient/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL (/patient/123)

    // Find all records that match this patient's ID
    const records = await Health.find({ patientId: id }).sort({ createdAt: -1 });
    res.json(records); // Return the records to the frontend
  } catch (err) {
    console.error("Get Patient History Error:", err);
    res.status(500).json({ msg: "Server error retrieving patient history" });
  }
});

module.exports = router;
