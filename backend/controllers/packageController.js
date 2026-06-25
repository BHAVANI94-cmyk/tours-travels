const Package = require("../models/Package");

// Add Package
exports.addPackage = async (req, res) => {
    try {
        const travelPackage = new Package(req.body);

        await travelPackage.save();

        res.json({
            message: "Package added successfully",
            data: travelPackage
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Get All Packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find();

        res.json(packages);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Get Single Package
exports.getPackageById = async (req, res) => {
    try {
        const travelPackage = await Package.findById(req.params.id);

        res.json(travelPackage);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Update Package
exports.updatePackage = async (req, res) => {
    try {
        const updated = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Package updated successfully",
            data: updated
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Delete Package
exports.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);

        res.json({
            message: "Package deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};