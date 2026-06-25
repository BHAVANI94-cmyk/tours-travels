const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPhone: String,
  itemName: String,
  itemType: String,
  itemId: String,
  checkIn: String,
  checkOut: String,
  persons: { type: Number, default: 1 },
  nights: { type: Number, default: 1 },
  total: Number,
  specialRequest: String,
  status: { type: String, default: 'pending' },
  userId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);