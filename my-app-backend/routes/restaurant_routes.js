const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controller/restaurantController");

const { protect, isVendor } = require("../middlewares/authMiddleware");

// ✅ Public routes
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

// ✅ Vendor-only routes
router.get("/vendor/me", protect, isVendor, getMyRestaurant);
router.post("/", protect, isVendor, createRestaurant);
router.put("/vendor/update", protect, isVendor, updateRestaurant);
router.delete("/vendor/delete", protect, isVendor, deleteRestaurant);

module.exports = router;
