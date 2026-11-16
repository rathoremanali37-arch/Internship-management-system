const express = require("express");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.get("/", protect, async (req, res, next) => {
  try {
    const ownedIds = req.user.role === "company" ? await Internship.find({ owner: req.user._id }).distinct("_id") : null;
    const applicationFilter = req.user.role === "student" ? { user: req.user._id }
      : req.user.role === "company" ? { internship: { $in: ownedIds } } : {};
    const [totalInternships, myApplications, shortlisted, companies] = await Promise.all([
      req.user.role === "company" ? Internship.countDocuments({ owner: req.user._id }) : Internship.countDocuments(),
      Application.countDocuments(applicationFilter),
      Application.countDocuments({ ...applicationFilter, status: "Shortlisted" }),
      req.user.role === "company" ? Internship.distinct("company", { owner: req.user._id }) : Internship.distinct("company")
    ]);
    res.status(200).json({ totalInternships, myApplications, shortlisted, companies: companies.length });
  } catch (error) { next(error); }
});
module.exports = router;
