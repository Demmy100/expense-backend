const express = require("express");
const { registerUser, loginUser, logoutUser, getUser, loginStatus } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/logout-user", logoutUser);
router.get("/get-user", protect, getUser);
router.get("/login-status", loginStatus);

module.exports = router;