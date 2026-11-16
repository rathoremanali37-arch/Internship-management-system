const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  note: { type: String, default: "" },
  status: { type: String, enum: ["Applied", "Shortlisted", "Rejected"], default: "Applied" }
}, { timestamps: true });

applicationSchema.index({ internship: 1, user: 1 }, { unique: true, partialFilterExpression: { user: { $type: "objectId" } } });
applicationSchema.index({ user: 1, status: 1 });
module.exports = mongoose.model("Application", applicationSchema);
