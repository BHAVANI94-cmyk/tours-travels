const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All admin routes are protected by authentication and admin role verification
router.use(authMiddleware);
router.use(adminMiddleware);

// Analytics
router.get("/analytics", adminController.getAnalytics);

// User management
router.get("/users", adminController.getUsers);
router.patch("/users/:id/role", adminController.changeUserRole);
router.patch("/users/:id/approve", adminController.approveSeller);
router.delete("/users/:id", adminController.deleteUser);

// Bookings management
router.get("/bookings", adminController.getBookings);
router.patch("/bookings/:id/cancel", adminController.cancelBooking);
router.delete("/bookings/:id", adminController.deleteBooking);

module.exports = router;
