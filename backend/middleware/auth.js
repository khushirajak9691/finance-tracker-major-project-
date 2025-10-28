const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization") || req.header("x-auth-token") || req.headers.authorization;
  const token = header ? (header.startsWith("Bearer ") ? header.split(" ")[1] : header) : null;

  if (!token) {
    console.warn("Auth middleware: No token provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware: decoded token:", decoded);

    // Support multiple token payload shapes
    // common payloads: { id: ... } or { user: { id: ... } } or { userId: ... }
    req.user = decoded.id || (decoded.user && decoded.user.id) || decoded.userId || null;

    if (!req.user) {
      console.warn("Auth middleware: token decoded but user id not found in payload");
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    next();
  } catch (err) {
    console.error("Auth middleware: Token verification failed:", err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};
