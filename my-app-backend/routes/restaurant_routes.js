const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  getNearbyRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controller/restaurantController");

const { protect, isVendor } = require("../middlewares/authMiddleware");

// ✅ Vendor-only routes
router.get("/vendor/me", protect, isVendor, getMyRestaurant);
router.post("/", protect, isVendor, createRestaurant);
router.put("/vendor/update", protect, isVendor, updateRestaurant);
router.delete("/vendor/delete", protect, isVendor, deleteRestaurant);

// ✅ Public routes
router.get("/", getAllRestaurants);
router.get("/nearby/search", getNearbyRestaurants);
router.get("/:id", getRestaurantById);

module.exports = router;
