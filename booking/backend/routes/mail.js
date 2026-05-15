const router = require("express").Router();
const { protect, admin } = require("../middleware/auth");
const { sendMail } = require("../controllers/mailController");

router.post("/send", protect, admin, sendMail);

module.exports = router;
