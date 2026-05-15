const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price:       { type: Number, required: true },
  category:    { type: String, default: "General" },
  stock:       { type: Number, default: 999 },
  icon:        { type: String, default: "🛍️" },
  image:       { type: String, default: "" },
  status:      { type: String, enum: ["active","draft","archived"], default: "active" },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
