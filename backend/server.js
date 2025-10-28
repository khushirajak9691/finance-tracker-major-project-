// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Middleware
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// ✅ Routes (⚠️ Make sure file names match)
try {
  app.use("/api/auth", require("./routes/auth")); // ✅ for signup/login
  app.use("/api/transactions", require("./routes/transaction")); // ✅ singular name — file should be `transaction.js`
} catch (err) {
  console.error("⚠️ Route loading error:", err.message);
}

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("Finance backend running ✅");
});

// ✅ Global Error Handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
