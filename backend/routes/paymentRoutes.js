const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// Payment routes protected by auth
router.use(authMiddleware);

router.post("/order", paymentController.createOrder);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;