const Restaurant = require("../models/Restaurant");

// Add restaurant
exports.addRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all restaurants
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get seller's own restaurants
exports.getMyRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ createdBy: req.user.id });
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single restaurant
exports.getRestaurantById = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let restaurant = null;
        if (!isNaN(req.params.id)) {
            restaurant = await Restaurant.findOne({ id: parseInt(req.params.id) });
        }
        if (!restaurant && mongoose.Types.ObjectId.isValid(req.params.id)) {
            restaurant = await Restaurant.findById(req.params.id);
        }
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let restaurant = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            restaurant = await Restaurant.findById(req.params.id);
        }
        if (!restaurant && !isNaN(req.params.id)) {
            restaurant = await Restaurant.findOne({ id: parseInt(req.params.id) });
        }
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Authorize: Admin or owner
        if (restaurant.createdBy && restaurant.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await Restaurant.findByIdAndDelete(restaurant._id);
        res.json({ message: "Restaurant deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
