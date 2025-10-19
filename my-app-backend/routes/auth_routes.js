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
    res.redirect('http://localhost:3000/vendor/dashboard'); 
});


router.post('/logout', (req, res, next) => {
//   console.log('1. Logout route started.');

  // With cookie-session, setting the session to null is the
  // standard way to destroy it. This bypasses the problematic
  // req.logout() function while achieving the same result.
  req.session = null;

//   console.log('2. Session cleared.');
  
  res.status(200).json({ message: 'Logged out successfully' });
//   console.log('3. Logout response sent.');
});
// GET /api/auth/current_user - Get the logged-in user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;

