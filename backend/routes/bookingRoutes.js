const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/add', authMiddleware, bookingController.addBooking);
router.get('/', authMiddleware, bookingController.getBookings);
router.get('/seller', authMiddleware, bookingController.getSellerBookings);
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);
router.delete('/:id', authMiddleware, bookingController.deleteBooking);

module.exports = router;