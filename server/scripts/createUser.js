// Provision a company/admin account from a trusted terminal (never expose this script publicly).
// Usage: node scripts/createUser.js "Company Name" company@example.com "StrongPassword123" company
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function main() {
  const [name, email, password, role] = process.argv.slice(2);
  if (!name || !email || !password || !["company", "admin"].includes(role)) {
    console.error('Usage: node scripts/createUser.js "Name" email password company|admin');
    process.exit(1);
  }
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/internship_db");
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("An account with this email already exists.");
  const user = await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12), role });
  console.log(`${role} account created: ${user.email}`);
  await mongoose.disconnect();
}
main().catch(async (error) => { console.error(error.message); await mongoose.disconnect().catch(() => {}); process.exit(1); });
