const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    id: Number,
    name: String,
    location: String,
    category: String,
    image: String,
    description: String,
    highlights: [String],
    dos: [String],
    donts: [String],
    entryCost: { type: Number, default: 0 },
    guidePrice: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    bestTime: String,
    photos: [String],
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Tour", tourSchema);