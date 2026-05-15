const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  business:    { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category:    { type: String, default: "General" },
  duration:    { type: String, default: "30 min" },
  price:       { type: Number, required: true },
  icon:        { type: String, default: "🛠️" },
  image:       { type: String, default: "" },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
