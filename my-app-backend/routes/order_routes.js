const express = require("express");
const router = express.Router();
const { protect, isVendor } = require("../middlewares/authMiddleware");
const { getVendorOrders, updateOrderStatus } = require("../controller/orderController");

// Get all orders for a vendor's restaurant
router.get("/vendor/:restaurantId", protect, isVendor, getVendorOrders);

// Update order status
router.put("/:id/status", protect, isVendor, updateOrderStatus);

module.exports = router;
