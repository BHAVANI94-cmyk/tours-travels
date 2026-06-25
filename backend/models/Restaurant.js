const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    id: Number,
    name: String,
    placeId: Number,
    placeName: String,
    image: String,
    description: String,
    cuisine: String,
    specialty: String,
    hours: String,
    priceFor2: Number,
    type: String,
    rating: { type: Number, default: 5 },
    contact: String,
    photos: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
