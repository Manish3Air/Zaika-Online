const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { signToken } = require('../utils/jwt'); // Import signToken
const router = express.Router();


// GET /api/auth/google - Initiates Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  try {
    // Create JWT token
    console.log("User after Google auth:", req.user);
    const token = jwt.sign(
      {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend success page with token
    const PROD_URL = process.env.PROD_URL || "http://localhost:3000";
    res.redirect(`${PROD_URL}/?token=${token}`);
  } catch (err) {
    console.error(err);
    res.redirect("/login?error=jwt");
  }
});

// GET /api/auth/current_user - Get the logged-in user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;

