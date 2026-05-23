const Order = require("../models/order");
const Restaurant = require("../models/restaurant");
const Dish = require("../models/dish");

const ORDER_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

// Place an order as a customer
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentDetails } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(422).json({ message: "Restaurant and items are required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const dishIds = items.map((item) => item.dishId);
    const dishes = await Dish.find({ _id: { $in: dishIds }, restaurantId });
    const dishesById = new Map(dishes.map((dish) => [dish._id.toString(), dish]));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const dish = dishesById.get(String(item.dishId));
      const quantity = Number(item.quantity);

      if (!dish || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(422).json({ message: "Invalid order item" });
      }

      orderItems.push({
        dishId: dish._id,
        name: dish.name,
        quantity,
        price: dish.price,
      });
      totalAmount += dish.price * quantity;
    }

    const order = await Order.create({
      customerId: req.user._id,
      restaurantId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentDetails: {
        paymentId: paymentDetails?.paymentId,
        status: paymentDetails?.status || "pending",
      },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in customer's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("restaurantId", "name logoUrl")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single logged-in customer's order for tracking
const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customerId: req.user._id,
    }).populate("restaurantId", "name logoUrl address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders for a vendor's restaurant
const getVendorOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check ownership
    const restaurantQuery = { _id: restaurantId };
    if (req.user.role !== "admin") {
      restaurantQuery.ownerId = req.user._id;
    }
    const restaurant = await Restaurant.findOne(restaurantQuery);
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

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(422).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(id).populate("restaurantId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check ownership
    if (req.user.role !== "admin" && order.restaurantId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getMyOrderById, getVendorOrders, updateOrderStatus };
