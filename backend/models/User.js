const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        type: String,
        default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    },
    joinedAt: {
        type: String,
        default: () => new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    },
    isApprovedSeller: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);