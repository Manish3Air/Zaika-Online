const jwt = require("jsonwebtoken");
const User = require("../models/user"); // make sure path is correct

// Middleware to protect routes (auth required)
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Authorization" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      // console.log("Token extracted from header:", token);
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);

    // Attach user info to req (with full user data)
    req.user = await User.findById(decoded._id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// ✅ Vendor role check middleware
const isVendor = (req, res, next) => {
  if (req.user && req.user.role === "vendor") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Vendor only" });
  }
};

// ✅ Admin role check (optional if you want)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin only" });
  }
};

module.exports = { protect, isVendor, isAdmin };
