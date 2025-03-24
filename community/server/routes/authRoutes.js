// =======================
// server/routes/authRoutes.js
// =======================
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup route (with invite code validation)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    // For now, we use a dummy invite code. Replace with your logic as needed.
    if (inviteCode !== "VALID_CODE") {
      return res.status(400).json({ error: "Invalid invite code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Set session with user info (default role is "Member")
    req.session.user = { id: newUser._id, role: newUser.role, email: newUser.email };

    res.json({ message: "User registered and logged in", user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Set session with user info
    req.session.user = { id: user._id, role: user.role, email: user.email };

    res.json({ message: "Logged in successfully", user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

// Get current user from session
router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

module.exports = router;
