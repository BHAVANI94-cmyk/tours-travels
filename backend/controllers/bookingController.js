const Booking = require('../models/Booking');

// Add booking
exports.addBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user.id
    });

    await booking.save();

    res.json({
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// Get bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Allow if owner or admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bookings for seller items
exports.getSellerBookings = async (req, res) => {
  try {
    const Hotel = require('../models/Hotel');
    const Tour = require('../models/Tour');
    
    // Find all hotels and tours owned by this seller
    const myHotels = await Hotel.find({ createdBy: req.user.id });
    const myTours = await Tour.find({ createdBy: req.user.id });
    
    // Collect possible item IDs (both ObjectId and numeric id if present)
    const hotelIds = myHotels.map(h => h._id.toString()).concat(myHotels.map(h => h.id ? h.id.toString() : ""));
    const tourIds = myTours.map(t => t._id.toString()).concat(myTours.map(t => t.id ? t.id.toString() : ""));
    const allItemIds = [...hotelIds, ...tourIds].filter(Boolean);
    
    const bookings = await Booking.find({ itemId: { $in: allItemIds } });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};