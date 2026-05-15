const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  title:   { type: String, required: true },
  body:    { type: String, default: "" },
  type:    { type: String, enum: ["info","success","warning","error","booking","payment","order","user"], default: "info" },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
