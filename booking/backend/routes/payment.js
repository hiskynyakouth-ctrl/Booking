const router = require("express").Router();
const { getAllPayments, getUserPayments, processPayment, refundPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getAllPayments); // Admin
router.get("/user", protect, getUserPayments);
router.post("/", protect, processPayment);
router.put("/:id/refund", protect, refundPayment);

module.exports = router;