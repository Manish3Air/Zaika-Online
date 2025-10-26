const Dish = require("../models/dish");
const Restaurant = require("../models/restaurant");

// Add a new dish
const createDish = async (req, res) => {
    try {
        const { restaurantId, name, description, imageUrl, price, category, isVeg } = req.body;

        // Check if vendor owns this restaurant
        const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.user._id });
        if (!restaurant) return res.status(403).json({ message: "Unauthorized" });

        const dish = await Dish.create({ restaurantId, name, description, imageUrl, price, category, isVeg });
        res.status(201).json(dish);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDishesByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check if user is logged in and is a vendor
        const isVendorRoute = req.user && req.user.role === "vendor";

        if (isVendorRoute) {
            // Verify vendor owns this restaurant
            const restaurant = await Restaurant.findOne({
                _id: restaurantId,
                ownerId: req.user._id,
            });

            if (!restaurant) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            // Vendor can see all dishes (even unpublished)
            const dishes = await Dish.find({ restaurantId });
            return res.json(dishes);
        } else {
            // Public access (customer side)
            // No need for ownership check — return only published dishes if needed
            const dishes = await Dish.find({ restaurantId });
            return res.json(dishes);
        }
    } catch (err) {
        console.error("Error fetching dishes:", err);
        res.status(500).json({ message: err.message });
    }
};



// Update a dish
const updateDish = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const dish = await Dish.findById(id).populate("restaurantId");
        if (!dish) return res.status(404).json({ message: "Dish not found" });

        // Check ownership
        if (dish.restaurantId.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        Object.assign(dish, updates);
        await dish.save();
        res.json(dish);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a dish
const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;

        const dish = await Dish.findById(id).populate("restaurantId");
        if (!dish) return res.status(404).json({ message: "Dish not found" });

        // Check ownership
        if (dish.restaurantId.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await dish.remove();
        res.json({ message: "Dish deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createDish,
    getDishesByRestaurant,
    updateDish,
    deleteDish,
};
