// =======================
// server/index.js
// =======================
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.use(express.json());

// Session-based auth (optional)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: false, // change to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// OPTIONAL: Import your API routes if any
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// Serve the React build from the 'dist' folder (make sure your build output is here)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// For any route not matching your API, serve React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Create an HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io with polling only and disable upgrades
const io = new Server(server, {
  transports: ["polling"],
  upgrade: false,
  allowUpgrades: false,
  pingInterval: 10000, // ping every 10 seconds
  pingTimeout: 5000,   // 5 seconds timeout
});

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("Chat message received on server:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
