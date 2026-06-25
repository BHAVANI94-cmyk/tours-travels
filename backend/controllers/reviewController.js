const Review = require("../models/Review");


// Add Review
exports.addReview = async (req, res) => {

    try {

        const review = new Review(
            req.body
        );

        await review.save();

        res.json({
            message: "Review added successfully",
            data: review
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};


// Get Reviews by Package
exports.getReviews = async (req, res) => {

    try {

        const reviews = await Review.find({
            packageId: req.params.packageId
        });

        res.json(
            reviews
        );

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};