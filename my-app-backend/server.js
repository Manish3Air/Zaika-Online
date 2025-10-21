// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

// Import models BEFORE passport
require('./models/user');
require('./models/restaurant');
require('./models/dish');
require('./models/order');
require('./models/review');

// Passport configuration
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth_routes');
const restaurantRoutes = require('./routes/restaurant_routes');
const dishRoutes = require('./routes/dish_routes');
const orderRoutes = require('./routes/order_routes');

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------
// ✅ FIXED CORS SETUP
// -------------------
const allowedOrigins = [
  'http://localhost:3000',
  'https://zaika-online.vercel.app',
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// ✅ TRUST PROXY — REQUIRED for Render/HTTPS cookies
app.set('trust proxy', 1);

// Parse incoming JSON
app.use(express.json());

// -------------------
// ✅ FIXED COOKIE SESSION
// -------------------
app.use(
  cookieSession({
    name: 'session',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY],
    sameSite: 'none',  // ✅ required for cross-site cookies
    secure: true,      // ✅ required for HTTPS on Render
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// -------------------
// API ROUTES
// -------------------
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

// -------------------
// TEST ROUTE
// -------------------
app.get('/api/test', (req, res) => {
  res.json({ user: req.user || null });
});

// -------------------
// START SERVER
// -------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
