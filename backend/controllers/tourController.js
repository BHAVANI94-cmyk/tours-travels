const Tour = require("../models/Tour");

// Add Tour
exports.addTour = async (req, res) => {
    try {
        const tour = new Tour(req.body);
        await tour.save();
        res.json({ message: "Tour added successfully", tour });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Tours
exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};