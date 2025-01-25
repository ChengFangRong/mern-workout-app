require("dotenv").config();
 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
 
// Import routes
const workoutRoutes = require("./routes/workouts");
 
// Initialize express app
const app = express();
 
// Middleware
app.use(express.json()); // Parse JSON data in request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend-backend communication
 
// Log the request method and path for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
 
// Routes
app.use("/api/workouts", workoutRoutes);
 
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server only after DB connection is established
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
 
// Default route for testing the server
app.get("/", (req, res) => {
  res.send("API is running...");
});
 
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});