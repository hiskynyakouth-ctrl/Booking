const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true, lowercase: true },
  category:    { type: String, required: true },
  description: { type: String, default: "" },
  address:     { type: String, default: "" },
  city:        { type: String, default: "" },
  phone:       { type: String, default: "" },
  email:       { type: String, default: "" },
  website:     { type: String, default: "" },
  logo:        { type: String, default: "" },
  images:      [{ type: String }],
  hours: {
    Mon: { type: String, default: "9AM–6PM" },
    Tue: { type: String, default: "9AM–6PM" },
    Wed: { type: String, default: "9AM–6PM" },
    Thu: { type: String, default: "9AM–6PM" },
    Fri: { type: String, default: "9AM–6PM" },
    Sat: { type: String, default: "10AM–4PM" },
    Sun: { type: String, default: "Closed" },
  },
  rating:    { type: Number, default: 0 },
  reviews:   { type: Number, default: 0 },
  verified:  { type: Boolean, default: false },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate slug from name
businessSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
  next();
});

module.exports = mongoose.model("Business", businessSchema);
