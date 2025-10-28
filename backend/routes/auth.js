const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { signup, login, getProfile, updateProfile } = require("../controllers/userController");
const { upload } = require("../utils/multer");
const { authMiddleware } = require("../middleware/auth");

// ✅ Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "No token provided. Authorization denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// ✅ Public Routes
router.post("/signup", signup);
router.post("/login", login);

// ✅ Protected Routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePic"), updateProfile);

module.exports = router;
