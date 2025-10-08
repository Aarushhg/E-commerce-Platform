const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Order = require("../models/Order"); // Make sure you have an Order model

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_GTJMRW7eJdFppG",
  key_secret: "odARQxIzLZ3zKsE9u0N6jyYA",
});

// Create Razorpay order
router.post("/orders", authMiddleware, async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // amount in paise
      currency: "INR",
      receipt: "receipt_order_" + new Date().getTime(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).send({ error: "Razorpay order creation failed" });
  }
});

// Verify payment
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // ✅ Payment verified, save order in DB
      const newOrder = await Order.create({
        user: req.user.id,
        customerName: orderData.customerName,
        address: orderData.address,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      // ✅ Clear cart if flag is true
      if (orderData.clearCart) {
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();
      }

      return res.json({ success: true, order: newOrder });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ success: false, error: "Payment verification failed" });
  }
});

module.exports = router;
