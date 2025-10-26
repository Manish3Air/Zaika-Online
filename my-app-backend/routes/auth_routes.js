const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { signToken } = require('../utils/jwt');
const Restaurant = require('../models/restaurant');
const router = express.Router();


router.get('/google', (req, res, next) => {
  // 1. Get the 'role' from the query string (e.g., 'customer' or 'vendor')
  const { role } = req.query;
  req.session.googleAuthRole = role || 'customer';
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});


// GET /api/auth/google/callback - Handles Google's response
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const role = req.user.role;

      const token = jwt.sign(
        {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: role,
          avatar: req.user.avatar,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Clean up the session variable
      if (req.session && req.session.googleAuthRole) {
        delete req.session.googleAuthRole;
      }

      const PROD_URL = process.env.PROD_URL || "http://localhost:3000";

      if (role === "vendor") {
        // ✅ Check if vendor already has a registered restaurant
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (restaurant) {
          // Already registered → redirect to vendor dashboard
          return res.redirect(`${PROD_URL}/vendor/dashboard?token=${token}`);
        } else {
          // Not registered → redirect to restaurant registration page
          return res.redirect(`${PROD_URL}/vendor?token=${token}`);
        }
      } else {
        // Customer or other roles
        return res.redirect(`${PROD_URL}/?token=${token}`);
      }
    } catch (err) {
      console.error(err);
      if (req.session && req.session.googleAuthRole) {
        delete req.session.googleAuthRole;
      }
      res.redirect("/?error=jwt");
    }
  }
);


// GET /api/auth/current_user - Get the logged-in user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;

