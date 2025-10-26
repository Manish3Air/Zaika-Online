const Restaurant = require("../models/restaurant");

// ✅ GET all restaurants (Public)
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching restaurants." });
  }
};

// ✅ GET restaurant by ID (Public)
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching restaurant." });
  }
};

// ✅ GET vendor's own restaurant (Vendor only)
const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    // console.log("Fetched restaurant for vendor:", restaurant);
    if (!restaurant) {
      return res.status(404).json({ error: "No restaurant found for this vendor." });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching vendor restaurant." });
  }
};

// ✅ CREATE a new restaurant (Vendor only)
const createRestaurant = async (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ error: "Only vendors can register restaurants." });
  }

  const { name, description, address, cuisine, openingHours, isVeg, logoUrl } = req.body;

  if (!name || !description) {
    return res.status(422).json({ error: "Name and description are required." });
  }

  try {
    const existing = await Restaurant.findOne({ ownerId: req.user._id });
    if (existing) {
      return res.status(400).json({ error: "You already have a registered restaurant." });
    }

    const restaurant = new Restaurant({
      name,
      description,
      address,
      cuisine,
      openingHours,
      isVeg,
      logoUrl,
      ownerId: req.user._id,
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create restaurant." });
  }
};

// ✅ UPDATE restaurant (Vendor only)
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update restaurant." });
  }
};

// ✅ DELETE restaurant (Vendor only)
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ ownerId: req.user._id });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found or already deleted." });
    }

    res.status(200).json({ message: "Restaurant deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete restaurant." });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
