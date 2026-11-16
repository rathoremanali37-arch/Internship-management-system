const express = require("express");
const mongoose = require("mongoose");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const { protect, allowRoles } = require("../middleware/auth");
const router = express.Router();

function escapeRegex(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Public internship listing and filters
router.get("/", async (req, res, next) => {
  try {
    const { search, location, mode, category } = req.query;
    const filter = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ role: regex }, { company: regex }, { skills: regex }];
    }
    if (location && location !== "All") filter.location = location;
    if (mode && mode !== "All") filter.mode = mode;
    if (category && category !== "All") filter.category = category;
    res.status(200).json(await Internship.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.get("/meta", async (req, res, next) => {
  try {
    const [locations, categories] = await Promise.all([Internship.distinct("location"), Internship.distinct("category")]);
    res.status(200).json({ locations: locations.sort(), categories: categories.sort() });
  } catch (error) { next(error); }
});

router.get("/mine", protect, allowRoles("company", "admin"), async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
    res.status(200).json(await Internship.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid internship ID." });
    const item = await Internship.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Internship not found." });
    res.status(200).json(item);
  } catch (error) { next(error); }
});

// Only company/admin accounts can create, edit or delete internship listings.
router.post("/", protect, allowRoles("company", "admin"), async (req, res, next) => {
  try {
    const item = await Internship.create({ ...req.body, owner: req.user.role === "admin" ? null : req.user._id });
    res.status(201).json(item);
  } catch (error) { next(error); }
});
router.put("/:id", protect, allowRoles("company", "admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid internship ID." });
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
    const item = await Internship.findOneAndUpdate(filter, { ...req.body, owner: req.user.role === "admin" ? undefined : req.user._id }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Internship not found." });
    res.status(200).json(item);
  } catch (error) { next(error); }
});
router.delete("/:id", protect, allowRoles("company", "admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid internship ID." });
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
    const existing = await Internship.findOne(filter);
    if (!existing) return res.status(404).json({ message: "Internship not found." });
    const existingApplications = await Application.countDocuments({ internship: req.params.id });
    if (existingApplications > 0) return res.status(409).json({ message: "This listing cannot be deleted while applications are attached." });
    await Internship.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Internship deleted." });
  } catch (error) { next(error); }
});
module.exports = router;
