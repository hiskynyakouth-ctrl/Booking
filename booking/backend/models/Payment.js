const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  booking:     { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
  order:       { type: mongoose.Schema.Types.ObjectId, ref: "Order",   default: null },
  type:        { type: String, enum: ["booking","product","subscription"], default: "booking" },
  description: { type: String, required: true },
  amount:      { type: Number, required: true },
  method:      { type: String, enum: ["card","bank_transfer","mobile","cbe","dashen","awash","dbb","lion","wegagen","bunna","debub","abyssinia"], default: "card" },
  bankName:    { type: String, default: null }, // For bank_transfer
  bankRef:     { type: String, default: null },
  cardLast4:   { type: String, default: null },
  status:      { type: String, enum: ["paid","pending","failed","refunded"], default: "paid" },
  refundedAt:  { type: Date, default: null },
  refundReason:{ type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
