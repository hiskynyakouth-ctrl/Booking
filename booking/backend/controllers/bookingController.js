const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

// GET /api/bookings — admin gets all, customer gets own
exports.getBookings = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bookings — customer creates booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceTitle, businessName, date, time, duration, price, notes, serviceIcon } = req.body;
    const booking = await Booking.create({
      user: req.user.id,
      serviceTitle,
      businessName: businessName || "Thiyang",
      date,
      time,
      duration: duration || "30 min",
      price,
      notes: notes || "",
      serviceIcon: serviceIcon || "📅",
      status: "pending",
      paymentStatus: "unpaid",
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id — admin verifies/rejects, customer cancels
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user", "name email _id");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { status, paymentStatus, adminNote } = req.body;

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (adminNote !== undefined) booking.adminNote = adminNote;

    await booking.save();

    // Notify customer when admin verifies or rejects
    if (status === "confirmed" || status === "cancelled") {
      await Notification.create({
        user: booking.user._id,
        title: status === "confirmed" ? "Booking Confirmed ✅" : "Booking Rejected ❌",
        body: status === "confirmed"
          ? `Your booking for ${booking.serviceTitle} on ${booking.date} has been confirmed.`
          : `Your booking for ${booking.serviceTitle} was rejected.${adminNote ? " Reason: " + adminNote : ""}`,
        type: status === "confirmed" ? "success" : "error",
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
