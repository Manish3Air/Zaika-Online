const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/authMiddleware');

const Dish = mongoose.model('Dish');
const Restaurant = mongoose.model('Restaurant');

// POST /api/dishes - Add a new dish to a menu (vendor only)
router.post('/', requireLogin, async (req, res) => {
    const { name, description, price, isVeg, category, restaurantId } = req.body;

    if (!name || !price || !isVeg || !restaurantId) {
        return res.status(422).send({ error: 'Name, price, veg status, and restaurant ID are required.' });
    }

    try {
        // Find the restaurant to ensure the logged-in user is the owner
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).send({ error: 'Restaurant not found.' });
        }

        // Check if the current user owns this restaurant
        if (restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).send({ error: "You don't have permission to add dishes to this restaurant." });
        }

        const dish = new Dish({
            name,
            description,
            price,
            isVeg,
            category,
            restaurantId
        });

        await dish.save();
        res.status(201).send(dish);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add dish.' });
    }
});

module.exports = router;

