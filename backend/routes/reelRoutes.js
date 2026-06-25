const express = require("express");
const router = express.Router();
const reelController = require("../controllers/reelController");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

// Public routes
router.get("/", reelController.getReels);

// Protected routes
router.post("/", authMiddleware, sellerMiddleware, reelController.createReel);
router.post("/:id/like", authMiddleware, reelController.likeReel);
router.post("/:id/save", authMiddleware, reelController.saveReel);
router.delete("/:id", authMiddleware, sellerMiddleware, reelController.deleteReel);
router.get("/seller/my", authMiddleware, reelController.getMyReels);

module.exports = router;
