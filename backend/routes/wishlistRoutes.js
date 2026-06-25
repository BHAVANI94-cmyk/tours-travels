const express = require("express");

const router = express.Router();

const wishlistController = require(
    "../controllers/wishlistController"
);


router.post(
    "/add",
    wishlistController.addWishlist
);

router.get(
    "/:userId",
    wishlistController.getWishlist
);

router.delete(
    "/:id",
    wishlistController.deleteWishlist
);


module.exports = router;