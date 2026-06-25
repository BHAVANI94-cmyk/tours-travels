const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 5
    },
    description: {
        type: String
    },
    availableSeats: {
        type: Number,
        default: 20
    }
});

module.exports = mongoose.model("Package", packageSchema);