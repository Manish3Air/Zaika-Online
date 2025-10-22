const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['customer', 'vendor'],
        default: 'customer',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
