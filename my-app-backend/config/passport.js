const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
require('dotenv').config();

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        const user = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            // By default, new users are customers. They can be changed to vendors manually
            // or through a separate vendor registration process in the future.
            role: 'customer' 
        }).save();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));
