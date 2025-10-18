const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /api/auth/google - Initiates Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /api/auth/google/callback - Google callback URL
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    // On successful authentication, redirect to the frontend dashboard
    // In a real app, you'd redirect to your frontend URL e.g., res.redirect('/dashboard');
    res.redirect('http://localhost:3000/dashboard'); 
});

// GET /api/auth/logout - Logs the user out
router.get('/logout', (req, res) => {
    req.logout();
    // Redirect to the frontend homepage
    res.redirect('http://localhost:3000/');
});

// GET /api/auth/current_user - Get the logged-in user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;

