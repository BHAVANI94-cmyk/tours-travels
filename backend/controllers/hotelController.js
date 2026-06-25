const Hotel =
    require("../models/Hotel");


// Add hotel
exports.addHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(hotel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get all hotels
exports.getHotels =
async (req, res) => {

    try {

        const hotels =
            await Hotel.find();

        res.json(hotels);

    }

    catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};


// Get single hotel
exports.getHotelById = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let hotel = null;
        if (!isNaN(req.params.id)) {
            hotel = await Hotel.findOne({ id: parseInt(req.params.id) });
        }
        if (!hotel && mongoose.Types.ObjectId.isValid(req.params.id)) {
            hotel = await Hotel.findById(req.params.id);
        }
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Search + Filter
exports.searchHotels =
async (req, res) => {

    try {

        const {
            location,
            maxPrice
        } = req.query;


        const hotels =
            await Hotel.find({

                location: location,

                pricePerNight: {
                    $lte: maxPrice
                }

            });


        res.json(hotels);

    }

    catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

// Get seller's own hotels
exports.getMyHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ createdBy: req.user.id });
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
    try {
        const mongoose = require("mongoose");
        let hotel = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            hotel = await Hotel.findById(req.params.id);
        }
        if (!hotel && !isNaN(req.params.id)) {
            hotel = await Hotel.findOne({ id: parseInt(req.params.id) });
        }
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Authorize: Admin or owner
        if (hotel.createdBy && hotel.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await Hotel.findByIdAndDelete(hotel._id);
        res.json({ message: "Hotel deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};