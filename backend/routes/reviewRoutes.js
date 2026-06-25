const express = require("express");

const router = express.Router();

const reviewController = require(
    "../controllers/reviewController"
);


// APIs
router.post(
    "/add",
    reviewController.addReview
);

router.get(
    "/:packageId",
    reviewController.getReviews
);


module.exports = router;