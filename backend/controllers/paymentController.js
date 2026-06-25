const crypto = require("crypto");
const Booking = require("../models/Booking");

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const hasKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

    if (hasKeys) {
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const options = {
        amount: Math.round(Number(amount) * 100), // in paise (e.g. 500 INR = 50000 paise)
        currency: "INR",
        receipt: `receipt_${bookingId || Date.now()}`
      };

      const order = await razorpay.orders.create(options);
      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        isMock: false
      });
    } else {
      // Mock payment mode if credentials are not configured
      console.log("⚠️ Razorpay credentials missing. Fallback to mock order.");
      return res.json({
        id: `order_mock_${Date.now()}`,
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        key: "rzp_test_mockkeyid",
        isMock: true
      });
    }
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Verify Razorpay signature and update booking status
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isMock = razorpay_order_id && razorpay_order_id.startsWith("order_mock_");

    if (isMock) {
      // Mock payment verification succeeds automatically
      booking.status = "confirmed";
      await booking.save();
      return res.json({
        message: "Mock payment verified successfully",
        booking
      });
    }

    // Verify real signature
    const hasKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
    if (!hasKeys) {
      return res.status(500).json({ message: "Payment gateway configuration error" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature verification failed" });
    }

    // Update booking status
    booking.status = "confirmed";
    await booking.save();

    res.json({
      message: "Payment verified successfully",
      booking
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: err.message });
  }
};