const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

// Public routes
router.get("/", hotelController.getHotels);
router.get("/search", hotelController.searchHotels);

// Protected routes
router.get("/seller/my", authMiddleware, hotelController.getMyHotels);
router.post("/add", authMiddleware, sellerMiddleware, hotelController.addHotel);
router.post("/", authMiddleware, sellerMiddleware, hotelController.addHotel);
router.delete("/:id", authMiddleware, sellerMiddleware, hotelController.deleteHotel);

// Generic ID handler (must be at the bottom)
router.get("/:id", hotelController.getHotelById);

module.exports = router;