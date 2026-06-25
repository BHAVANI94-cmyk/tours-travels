const Reel = require("../models/Reel");

// Get all reels
exports.getReels = async (req, res) => {
  try {
    const reels = await Reel.find().populate("createdBy", "name email");
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new reel
exports.createReel = async (req, res) => {
  try {
    const reel = new Reel({
      ...req.body,
      createdBy: req.user.id
    });
    await reel.save();
    res.status(201).json(reel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle like on a reel
exports.likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const userId = req.user.id;
    const index = reel.likes.indexOf(userId);

    if (index === -1) {
      reel.likes.push(userId);
    } else {
      reel.likes.splice(index, 1);
    }

    await reel.save();
    res.json({ message: index === -1 ? "Reel liked" : "Reel unliked", likes: reel.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle save on a reel
exports.saveReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const userId = req.user.id;
    const index = reel.saves.indexOf(userId);

    if (index === -1) {
      reel.saves.push(userId);
    } else {
      reel.saves.splice(index, 1);
    }

    await reel.save();
    res.json({ message: index === -1 ? "Reel saved" : "Reel unsaved", saves: reel.saves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a reel
exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    // Allow deletion if the user is the creator or an admin
    if (reel.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Reel.findByIdAndDelete(req.params.id);
    res.json({ message: "Reel deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get seller's reels
exports.getMyReels = async (req, res) => {
  try {
    const reels = await Reel.find({ createdBy: req.user.id });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
