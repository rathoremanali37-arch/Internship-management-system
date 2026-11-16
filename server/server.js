const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Internship = require("./models/Internship");
const Application = require("./models/Application");
const sampleInternships = require("./data/sampleInternships");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => { console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`); next(); });

app.get("/", (req, res) => res.status(200).send("Internship Management API is running"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/internships", require("./routes/internshipRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use((req, res) => res.status(404).json({ message: "API route not found." }));

// Centralized error handler: validation, duplicate-key and unexpected server errors.
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
  if (error.name === "CastError") return res.status(400).json({ message: "Invalid resource ID." });
  if (error.code === 11000) return res.status(409).json({ message: "A record with these details already exists." });
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing. Add it to server/.env before starting the API.");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/internship_db");
    console.log("MongoDB connected");

    // Build the new account-scoped index, then remove the old demo index that
    // enforced uniqueness by internship + email across all accounts.
    await Application.init();
    const existingIndexes = await Application.collection.indexes();
    const legacyIndex = existingIndexes.find((index) => index.key?.internship === 1 && index.key?.email === 1);
    if (legacyIndex) {
      await Application.collection.dropIndex(legacyIndex.name);
      console.log("Legacy application index migrated");
    }

    if (await Internship.countDocuments() === 0) {
      await Internship.insertMany(sampleInternships);
      console.log("Sample internships added");
    }
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Could not start server:", error.message);
    process.exit(1);
  }
}
startServer();
