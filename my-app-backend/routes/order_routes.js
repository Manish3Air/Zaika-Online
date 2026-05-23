const express = require("express");
const router = express.Router();
const { protect, isVendor, isCustomer } = require("../middlewares/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getVendorOrders,
  updateOrderStatus,
} = require("../controller/orderController");

// Customer routes
router.post("/", protect, isCustomer, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, isCustomer, getMyOrderById);

// Get all orders for a vendor's restaurant
router.get("/vendor/:restaurantId", protect, isVendor, getVendorOrders);

// Update order status
router.put("/:id/status", protect, isVendor, updateOrderStatus);

module.exports = router;
