const Payment = require("../models/Payment");

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments for a user
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process a payment
exports.processPayment = async (req, res) => {
  try {
    const { booking, order, type, description, amount, method, bankName, bankRef, cardLast4 } = req.body;
    const status = method === "card" ? "paid" : "pending";
    const payment = new Payment({
      user: req.user.id,
      booking,
      order,
      type,
      description,
      amount,
      method,
      bankName,
      bankRef,
      cardLast4,
      status,
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refund a payment
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    payment.status = "refunded";
    payment.refundedAt = new Date();
    payment.refundReason = req.body.reason || "";
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};