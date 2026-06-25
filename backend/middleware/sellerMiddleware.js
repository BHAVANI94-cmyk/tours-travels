const User = require("../models/User");

const sellerMiddleware = async (req, res, next) => {
  try {
    // Admins have access to all seller features
    if (req.user.role === "admin") {
      return next();
    }

    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Seller role required" });
    }

    // Query database for latest seller approval status
    const dbUser = await User.findById(req.user.id);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!dbUser.isApprovedSeller) {
      return res.status(403).json({
        message: "Your seller account is pending admin approval. You cannot manage listings yet."
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = sellerMiddleware;
