const router = require("express").Router();
const { protect, admin } = require("../middleware/auth");
const {
  getUsers,
  getMe,
  updateMe,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", protect, admin, getUsers);
router.post("/", protect, admin, createUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
