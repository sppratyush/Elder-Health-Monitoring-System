require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Keep the app simple and initialize Express
const app = express();

// Middleware
app.use(express.json()); // Allow the app to accept JSON data in requests
app.use(cors()); // Allow frontend at localhost:3000 to communicate with this backend

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import the Routes files
const authRoutes = require("./routes/auth");
const healthRoutes = require("./routes/health");

// Use the Routes
// For example, any request to /auth/login goes to the authRoutes file
app.use("/auth", authRoutes);

// Any request to /api/health goes to healthRoutes. 
app.use("/api/health", healthRoutes);

// Catch-all route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Elder Health API is running!");
});

// Start the server (Only run if not exported for Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Export the app for Vercel Serverless Functions
module.exports = app;
