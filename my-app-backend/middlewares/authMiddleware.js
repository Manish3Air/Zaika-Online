const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to req
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = protect;
