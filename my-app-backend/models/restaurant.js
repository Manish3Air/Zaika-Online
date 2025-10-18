const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    logoUrl: String,
    cuisine: [String],
    openingHours: String,
    isVeg: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
