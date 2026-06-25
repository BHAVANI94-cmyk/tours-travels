const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    packageId: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Wishlist",
    wishlistSchema
);