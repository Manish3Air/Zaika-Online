// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const connectDB = require('./config/db');
require('dotenv').config();
connectDB();

// Mongoose Models need to be imported before passport uses them
require('./models/user'); 
require('./models/restaurant');
require('./models/dish'); 
require('./models/order'); 
require('./models/review');

// Passport configuration
require('./config/passport');

// // Import routes
const authRoutes = require('./routes/auth_routes');
const restaurantRoutes = require('./routes/restaurant_routes');
const dishRoutes = require('./routes/dish_routes');
const orderRoutes = require('./routes/order_routes');






// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',    // e.g. http://localhost:3000
  'https://zaika-online.vercel.app',   // e.g. https://yourproductiondomain.com
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps)

    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
}));

app.use(express.json());

app.use(
  cookieSession({
    name: 'session',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port:${PORT}`);
});

