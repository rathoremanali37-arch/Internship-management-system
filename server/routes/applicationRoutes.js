const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// GET /api/applications - only the signed-in student's applications
router.get("/", async (req, res, next) => {
  try {
    let filter = { user: req.user._id };
    if (req.user.role === "company") {
      const owned = await Internship.find({ owner: req.user._id }).distinct("_id");
      filter = { internship: { $in: owned } };
    } else if (req.user.role === "admin") filter = {};
    const applications = await Application.find(filter).populate("internship").populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) { next(error); }
});

// POST /api/applications - create an application for the signed-in student
router.post("/", allowRoles("student"), async (req, res, next) => {
  try {
    const { internshipId, name, email, phone, note } = req.body;
    if (!mongoose.isValidObjectId(internshipId)) return res.status(400).json({ message: "A valid internship is required." });
    if (!/^\d{10}$/.test(phone || "")) {
      return res.status(400).json({ message: "Enter a valid 10-digit phone number." });
    }
    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ message: "Internship not found." });
    const application = await Application.create({ user: req.user._id, internship: internshipId, name: req.user.name, email: req.user.email, phone, note });
    await application.populate("internship");
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You have already applied for this internship." });
    next(error);
  }
});

// Company/admin users update application status.
router.patch("/:id/status", allowRoles("company", "admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid application ID." });
    const { status } = req.body;
    if (!["Applied", "Shortlisted", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid application status." });
    const application = await Application.findById(req.params.id).populate("internship");
    if (!application) return res.status(404).json({ message: "Application not found." });
    if (req.user.role === "company" && String(application.internship?.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can update applications only for your own internship listings." });
    }
    application.status = status;
    await application.save();
    await application.populate("internship");
    res.status(200).json(application);
  } catch (error) { next(error); }
});

// A student can withdraw only their own application.
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid application ID." });
    const deleted = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Application not found." });
    res.status(200).json({ message: "Application withdrawn." });
  } catch (error) { next(error); }
});
module.exports = router;
