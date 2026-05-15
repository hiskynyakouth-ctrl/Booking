const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
  business:    { type: mongoose.Schema.Types.ObjectId, ref: "Business", default: null },
  service:     { type: mongoose.Schema.Types.ObjectId, ref: "Service",  default: null },
  serviceTitle:{ type: String, required: true },
  businessName:{ type: String, default: "Thiyang" },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  duration:    { type: String, default: "30 min" },
  price:       { type: Number, required: true },
  notes:       { type: String, default: "" },
  status:      { type: String, enum: ["pending","confirmed","completed","cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid","paid","verified"], default: "unpaid" },
  adminNote:   { type: String, default: "" },
  serviceIcon: { type: String, default: "📅" },
  paymentId:   { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
