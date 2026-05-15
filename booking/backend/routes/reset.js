// reset.js — dev/admin only route to wipe all data except users
const router = require("express").Router();
const { protect, admin } = require("../middleware/auth");
const Payment      = require("../models/Payment");
const Booking      = require("../models/Booking");
const Notification = require("../models/Notification");
const Order        = require("../models/Order");
const EmailLog     = require("../models/EmailLog");

router.delete("/all", protect, admin, async (req, res) => {
  try {
    await Promise.all([
      Payment.deleteMany({}),
      Booking.deleteMany({}),
      Notification.deleteMany({}),
      Order?.deleteMany ? Order.deleteMany({}) : Promise.resolve(),
      EmailLog?.deleteMany ? EmailLog.deleteMany({}) : Promise.resolve(),
    ]);
    res.json({ message: "All data cleared. Users kept." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
