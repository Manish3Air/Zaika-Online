const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
    dishId: {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
    },
    name: String,
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: Number,
});

const orderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'placed',
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    paymentDetails: {
        paymentId: String,
        status: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
