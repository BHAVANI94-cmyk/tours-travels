const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "backend", ".env") });

const Booking = require("./backend/models/Booking");
const User = require("./backend/models/User");

async function check() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/toursDB";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    console.log("\n=================== USERS ===================");
    const users = await User.find({});
    if (users.length === 0) {
      console.log("No users found in database.");
    } else {
      users.forEach(u => {
        console.log(`- ID: ${u._id} | Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
      });
    }

    console.log("\n=================== BOOKINGS ===================");
    const bookings = await Booking.find({});
    if (bookings.length === 0) {
      console.log("No bookings found in database.");
    } else {
      bookings.forEach(b => {
        console.log(`- ID: ${b._id}`);
        console.log(`  User: ${b.userName} (${b.userEmail} | ${b.userPhone})`);
        console.log(`  Item: ${b.itemName} (${b.itemType})`);
        console.log(`  Dates: ${b.checkIn} to ${b.checkOut} (${b.nights} nights, ${b.persons} guests)`);
        console.log(`  Total Cost: ₹${b.total}`);
        console.log(`  Status: ${b.status}`);
        console.log(`  Special Request: ${b.specialRequest || "None"}`);
        console.log("------------------------------------------------");
      });
    }

  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

check();
