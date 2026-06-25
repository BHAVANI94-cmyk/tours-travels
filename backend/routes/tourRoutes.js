const express = require('express');
const router = express.Router();

const Tour = require('../models/Tour');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const sellerMiddleware = require('../middleware/sellerMiddleware');

// GET all tours
router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET seller's own tours
router.get('/seller/my', authMiddleware, async (req, res) => {
    try {
        const tours = await Tour.find({ createdBy: req.user.id });
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single tour
router.get('/:id', async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let tour = null;
        if (!isNaN(req.params.id)) {
            tour = await Tour.findOne({ id: parseInt(req.params.id) });
        }
        if (!tour && mongoose.Types.ObjectId.isValid(req.params.id)) {
            tour = await Tour.findById(req.params.id);
        }
        if (!tour) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.json(tour);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD tour (Admin or Seller)
const addTour = async (req, res) => {
    try {
        const { name, title, location, price, description, category, image, imageUrl, bestTime } = req.body;
        const finalName = name || title;
        const finalImage = image || imageUrl;

        if (!finalName || !location || !price) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newTour = new Tour({
            name: finalName,
            location,
            price: Number(price),
            description,
            category,
            image: finalImage,
            bestTime,
            createdBy: req.user.id
        });

        await newTour.save();
        res.status(201).json(newTour);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

router.post('/add', authMiddleware, sellerMiddleware, addTour);
router.post('/', authMiddleware, sellerMiddleware, addTour);

// UPDATE tour (Admin or Seller)
const updateTour = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let tour = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            tour = await Tour.findById(req.params.id);
        }
        if (!tour && !isNaN(req.params.id)) {
            tour = await Tour.findOne({ id: parseInt(req.params.id) });
        }

        if (!tour) {
            return res.status(404).json({ message: "Place not found" });
        }

        // Authorize: Admin or owner
        if (tour.createdBy && tour.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Map inputs
        const { name, title, image, imageUrl, price } = req.body;
        if (title) req.body.name = title;
        if (name) req.body.name = name;
        if (imageUrl) req.body.image = imageUrl;
        if (image) req.body.image = image;
        if (price) req.body.price = Number(price);

        const updated = await Tour.findByIdAndUpdate(tour._id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

router.put('/update/:id', authMiddleware, sellerMiddleware, updateTour);
router.put('/:id', authMiddleware, sellerMiddleware, updateTour);
router.patch('/:id', authMiddleware, sellerMiddleware, updateTour);

// DELETE tour (Admin or Seller)
const deleteTour = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let tour = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            tour = await Tour.findById(req.params.id);
        }
        if (!tour && !isNaN(req.params.id)) {
            tour = await Tour.findOne({ id: parseInt(req.params.id) });
        }

        if (!tour) {
            return res.status(404).json({ message: "Place not found" });
        }

        // Authorize: Admin or owner
        if (tour.createdBy && tour.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await Tour.findByIdAndDelete(tour._id);
        res.json({ message: "Tour deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

router.delete('/delete/:id', authMiddleware, sellerMiddleware, deleteTour);
router.delete('/:id', authMiddleware, sellerMiddleware, deleteTour);

module.exports = router;