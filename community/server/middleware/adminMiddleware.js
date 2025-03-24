// =======================
// server/middleware/adminMiddleware.js
// =======================
module.exports = (req, res, next) => {
    // We assume req.user is set by authMiddleware (JWT check)
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
  
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
  
    // If user is Admin, proceed
    next();
  };
  