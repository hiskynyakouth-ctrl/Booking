const router = require("express").Router();
const { getBookings, createBooking, updateBooking, deleteBooking } = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/auth");

router.get("/",        protect, getBookings);
router.post("/",       protect, createBooking);
router.put("/:id",     protect, updateBooking);
router.delete("/:id",  protect, admin, deleteBooking);

module.exports = router;
