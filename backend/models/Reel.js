const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  url: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  price: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model("Reel", reelSchema);
