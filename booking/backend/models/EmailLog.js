const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: String,
  url: String,
  size: Number,
}, { _id: false });

const EmailLogSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to:   { type: String, required: true },
  subject: String,
  text: String,
  html: String,
  attachments: [AttachmentSchema],
  status: { type: String, default: "sent" },
  error: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmailLog", EmailLogSchema);
