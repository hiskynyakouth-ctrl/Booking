const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:     { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  qty:         { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:       [orderItemSchema],
  total:       { type: Number, required: true },
  status:      { type: String, enum: ["pending","processing","shipped","delivered","cancelled","refunded"], default: "pending" },
  paymentId:   { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },
  paymentMethod:{ type: String, enum: ["card","bank_transfer","mobile"], default: "card" },
  shippingAddress: { type: String, default: "" },
  notes:       { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
