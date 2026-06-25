const Wishlist = require("../models/Wishlist");


// Add to wishlist
exports.addWishlist = async (req, res) => {

    try {

        const wishlist = new Wishlist(
            req.body
        );

        await wishlist.save();

        res.json({
            message: "Added to wishlist",
            data: wishlist
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};


// Get user wishlist
exports.getWishlist = async (req, res) => {

    try {

        const wishlist = await Wishlist.find({
            userId: req.params.userId
        });

        res.json(
            wishlist
        );

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};


// Delete wishlist
exports.deleteWishlist = async (req, res) => {

    try {

        await Wishlist.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Removed from wishlist"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};