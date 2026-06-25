const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

// Public routes
router.get("/", restaurantController.getRestaurants);

// Protected routes
router.get("/seller/my", authMiddleware, restaurantController.getMyRestaurants);
router.post("/add", authMiddleware, sellerMiddleware, restaurantController.addRestaurant);
router.post("/", authMiddleware, sellerMiddleware, restaurantController.addRestaurant);
router.delete("/:id", authMiddleware, sellerMiddleware, restaurantController.deleteRestaurant);

// Generic ID handler (must be at the bottom)
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;
