const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    id: Number,
    name: String,
    placeId: Number,
    placeName: String,
    image: String,
    description: String,
    style: String,
    stars: { type: Number, default: 5 },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    amenities: [String],
    price: Number,
    available: { type: Boolean, default: true },
    photos: [String],
    features: [String],
    policies: [String],
    contact: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports =
    mongoose.model(
        "Hotel",
        hotelSchema
    );