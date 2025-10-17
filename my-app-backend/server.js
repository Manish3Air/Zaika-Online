// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('dotenv').config();

// Mongoose Models need to be imported before passport uses them
require('./models/User'); 
require('./models/Restaurant');

// Passport configuration
require('./services/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');

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


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB Atlas!'))
.catch(error => console.error('Error connecting to MongoDB:', error));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

