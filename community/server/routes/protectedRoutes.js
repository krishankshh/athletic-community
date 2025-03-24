const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// A sample protected route (e.g., user profile)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected profile route", user: req.user });
});

module.exports = router;
