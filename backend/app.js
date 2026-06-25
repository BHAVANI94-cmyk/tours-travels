const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const app = express();


// Middleware
app.use(express.json());
app.use(cors());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("✅ MongoDB Connected");

})

.catch((err) => {

    console.log(
        "❌ Database Error:",
        err
    );

});


// Routes
app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/tours",
    require("./routes/tourRoutes")
);

app.use(
    "/api/bookings",
    require("./routes/bookingRoutes")
);

app.use(
    "/api/payment",
    require("./routes/paymentRoutes")
);

app.use(
    "/api/packages",
    require("./routes/packageRoutes")
);

app.use(
    "/api/reviews",
    require("./routes/reviewRoutes")
);

app.use(
    "/api/wishlist",
    require("./routes/wishlistRoutes")
);

app.use(
    "/api/ai",
    require("./routes/aiRoutes")
);
app.use(
    "/api/hotels",
    require("./routes/hotelRoutes")
);
app.use(
    "/api/offers",
    require("./routes/offerRoutes")
);
app.use(
    "/api/suggestions",
    require("./routes/suggestionRoutes")
);
app.use(
    "/api/places",
    require("./routes/tourRoutes")
);
app.use(
    "/api/restaurants",
    require("./routes/restaurantRoutes")
);
app.use(
    "/api/reels",
    require("./routes/reelRoutes")
);
app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);

// Serve Static Frontend Assets (Production)
app.use(express.static(path.join(__dirname, "frontend/dist")));

// API Wildcard 404 Handler
app.use("/api/*splat", (req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});

// React routing fallback
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});


// Server Start
const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `✅ Server running on http://localhost:${PORT}`
    );

});