const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    id: String,
    type: String,
    targetId: Number,
    name: String,
    description: String,
    originalPrice: Number,
    offerPrice: Number,
    validUntil: String,
    badge: String,
    badgeColor: String,
    discount: Number
});

module.exports =
    mongoose.model(
        "Offer",
        offerSchema
    );