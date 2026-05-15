require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./models/User");

// ── Set your admin credentials here ──────────────────────────────────────────
const ADMIN_NAME     = "Thiyang Koang";
const ADMIN_EMAIL    = "thiyang@gmail.com";
const ADMIN_PASSWORD = "admin123";
// ─────────────────────────────────────────────────────────────────────────────

const run = async () => {
  await mongoose.connect(process.env.db);

  // Remove existing admin with same email if any
  await User.deleteOne({ email: ADMIN_EMAIL });

  // Let the model's pre-save hook handle hashing — do NOT pre-hash here
  const admin  = await User.create({
    name:     ADMIN_NAME,
    email:    ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role:     "admin",
  });

  console.log("✅ Admin created:");
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   ID:       ${admin._id}`);
  process.exit(0);
};

run().catch(err => { console.error("❌", err.message); process.exit(1); });
