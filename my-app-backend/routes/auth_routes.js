const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /api/auth/google - Initiates Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /api/auth/google/callback - Google callback URL
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    const url = process.env.PROD_URL || 'http://localhost:3000';
    res.redirect(`${url}/vendor/dashboard`);
});


router.post('/logout', (req, res, next) => {
  req.session = null;
  res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/current_user - Get the logged-in user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;

