const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
require('dotenv').config();

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Await the promise from the database query
    const user = await User.findById(id);
    
    // Pass the user to the 'done' callback (user can be null if not found)
    done(null, user);
  } catch (err) {
    // If any error occurs during the query, pass it to the 'done' callback
    done(err, null);
  }
});

// In config/passport.js

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => { 
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }

    // User not found, create them
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      role: req.session.googleAuthRole || 'customer'
    });
    await user.save();
    return done(null, user);
  }
));
