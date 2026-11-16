// MODEL: describes how one internship is stored in MongoDB.
// A "model" is a JavaScript class created from a "schema" (the structure of a document).
const mongoose = require("mongoose");

// Schema = list of fields and their rules (type, required, default ...)
const internshipSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },     // e.g. "Infosys"
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    role: { type: String, required: true, trim: true },        // e.g. "Data Analyst Intern"
    location: { type: String, required: true, trim: true },    // e.g. "Bengaluru"
    mode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],                    // only these 3 values are allowed
      default: "On-site"
    },
    duration: { type: String, required: true },                // e.g. "3 Months"
    stipend: { type: Number, default: 0 },                     // rupees per month (0 = unpaid)
    category: { type: String, default: "Other" },              // used by the category filter
    skills: [String],                                          // array of strings
    deadline: { type: String },                                // last date to apply (YYYY-MM-DD)
    description: { type: String }
  },
  // timestamps: true makes Mongoose add createdAt and updatedAt automatically
  { timestamps: true }
);

// mongoose.model("Internship", ...) creates the "internships" collection in MongoDB
module.exports = mongoose.model("Internship", internshipSchema);
