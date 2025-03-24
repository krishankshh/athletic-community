// =======================
// server/models/User.js
// =======================
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Verified Trainer", "Verified Dietician", "Member"],
    default: "Member",
  },
});

module.exports = mongoose.model("User", userSchema);
