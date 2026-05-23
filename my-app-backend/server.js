// 🌐 Import core packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("dotenv").config();

// 🧠 Import local modules
const connectDB = require("./config/db");

// 🧩 Import models (must be before routes & passport)
require("./models/user");
require("./models/restaurant");
require("./models/dish");
require("./models/order");
require("./models/review");

// 🔑 Passport configuration
require("./config/passport");

// 🛣️ Import routes
const authRoutes = require("./routes/auth_routes");
const restaurantRoutes = require("./routes/restaurant_routes");
const dishRoutes = require("./routes/dish_routes");
const orderRoutes = require("./routes/order_routes");
const adminRoutes = require("./routes/admin_routes");

// ⚙️ Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// 🧭 Connect MongoDB
connectDB();

// 🌍 Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://zaika-online.vercel.app",
];

// 🧱 Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY],
    sameSite: "lax", // prevents cross-site issues
    secure: process.env.NODE_ENV === "production", // secure in production
  })
);

app.set("trust proxy", 1);

// 🧾 Body Parser
app.use(express.json());

// 🔐 Passport Initialization
app.use(passport.initialize());

// 🚦 Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// 🧪 Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Server working fine!" });
});

// 🧩 Error Handling (Optional but good practice)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
