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
    sameSite: 'none',  // ✅ always None for cross-site
    secure: true,      // ✅ required for HTTPS (Render uses HTTPS)
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

// Simple route to test auth cookie
app.get('/api/test', (req, res) => {
  res.json({ user: req.user || null });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
