const express = require("express");
const { protect, isVendor } = require("../middlewares/authMiddleware");
const {
  createDish,
  updateDish,
  deleteDish,
  getDishesByRestaurant,
} = require("../controller/dishController");

const router = express.Router();

router.post("/", protect, isVendor, createDish);
router.put("/:id", protect, isVendor, updateDish);
router.delete("/:id", protect, isVendor, deleteDish);

// Vendor can view their own dishes (authenticated)
router.get("/vendor/restaurants/:restaurantId/dishes", protect, isVendor, getDishesByRestaurant);

// Public (no auth)
router.get("/restaurants/:restaurantId/dishes", getDishesByRestaurant);


module.exports = router;
