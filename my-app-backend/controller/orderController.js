const Order = require("../models/order");
const Restaurant = require("../models/restaurant");

// Get all orders for a vendor's restaurant
const getVendorOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check ownership
    const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.user._id });
    if (!restaurant) return res.status(403).json({ message: "Unauthorized" });

    const orders = await Order.find({ restaurantId }).populate("customerId", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id).populate("restaurantId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check ownership
    if (order.restaurantId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getVendorOrders, updateOrderStatus };
