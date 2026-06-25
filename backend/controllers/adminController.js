const User = require("../models/User");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Tour = require("../models/Tour");
const Restaurant = require("../models/Restaurant");
const Reel = require("../models/Reel");

// Get overall platform statistics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalBookings = await Booking.countDocuments();

    // Total sales revenue from confirmed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, totalSales: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalSales : 0;

    // Listings counts
    const hotelCount = await Hotel.countDocuments();
    const tourCount = await Tour.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    const reelCount = await Reel.countDocuments();

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Bookings breakdown by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalSellers,
        totalBookings,
        totalRevenue,
        listings: {
          hotels: hotelCount,
          tours: tourCount,
          restaurants: restaurantCount,
          reels: reelCount,
          total: hotelCount + tourCount + restaurantCount + reelCount
        }
      },
      recentBookings,
      bookingsByStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get list of all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ joinedAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change user role
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "seller", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const updateData = { role };
    // If making them a seller, default approval to false (require explicit approval)
    // If changing from seller, clean approval status
    if (role === "seller") {
      updateData.isApprovedSeller = false;
    } else {
      updateData.isApprovedSeller = false;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve a seller
exports.approveSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "seller") {
      return res.status(400).json({ message: "User is not a seller" });
    }

    user.isApprovedSeller = true;
    await user.save();

    res.json({ message: "Seller approved successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get list of all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel any booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete any booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
