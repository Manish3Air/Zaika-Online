const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const protect = require('../middlewares/authMiddleware');

const Restaurant = mongoose.model('Restaurant');

// GET /api/restaurants - Get all restaurants (public)
// We will add filtering and search later.
router.get('/', async (req, res) => {
    // console.log("Api hit");
    try {
        const restaurants = await Restaurant.find({});
        // console.log("Restaurants fetched:", restaurants.length);
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching restaurants.' });
    }
});

// POST /api/restaurants - Register a new restaurant (vendor only)
router.post('/', protect, async (req, res) => {
    // A simple check for vendor role. This could be a more robust middleware.
    // console.log("API HIT")
    if (req.user.role !== 'vendor') {
        return res.status(403).send({ error: 'Only vendors can register restaurants.' });
    }

    const { name, description, address, cuisine, openingHours } = req.body;

    if (!name || !description) {
        return res.status(422).send({ error: 'Name and description are required.' });
    }

    try {
        const restaurant = new Restaurant({
            name,
            description,
            address,
            cuisine,
            openingHours,
            ownerId: req.user._id
        });
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (err) {
        res.status(500).send({ error: 'Failed to create restaurant.' });
    }
});

module.exports = router;

