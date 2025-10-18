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
app.use(cors());
app.use(express.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: [process.env.COOKIE_KEY]
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

