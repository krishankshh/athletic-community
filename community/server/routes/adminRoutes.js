// =======================
// server/routes/adminRoutes.js
// =======================
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if a user is logged in and is an Admin
const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "Admin") {
    return next();
  }
  res.status(403).json({ error: "Access denied. Admins only." });
};

// Get all users (Admins only)
router.get("/users", requireAdmin, async (req, res) => {
  try {
    // Exclude passwords
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update user role (Admins only)
router.patch("/update-role", requireAdmin, async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const allowedRoles = ["Admin", "Verified Trainer", "Verified Dietician", "Member"];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = newRole;
    await user.save();

    res.json({ message: "Role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
