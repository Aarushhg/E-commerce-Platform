const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to authenticate user
const authMiddleware = require("../middleware/authMiddleware");

// GET user's cart with populated product details
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("cart.productId", "name price image")
      .exec();

    res.json(user.cart);
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// ADD or UPDATE product in cart
router.post("/", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    const populatedCart = await User.findById(req.user.id)
      .populate("cart.productId", "name price image")
      .exec();

    res.json(populatedCart.cart);
  } catch (err) {
    console.error("Failed to add to cart:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// REMOVE product from cart
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await user.save();

    const populatedCart = await User.findById(req.user.id)
      .populate("cart.productId", "name price image")
      .exec();

    res.json(populatedCart.cart);
  } catch (err) {
    console.error("Failed to remove from cart:", err);
    res.status(500).json({ message: "Failed to remove from cart" });
  }
});

// UPDATE product quantity (+ or -)
router.put("/", authMiddleware, async (req, res) => {
  const { productId, action } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.find((item) => item.productId.toString() === productId);

    if (item) {
      if (action === "increase") {
        item.quantity += 1;
      } else if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          // remove item if quantity drops to 0
          user.cart = user.cart.filter(
            (cartItem) => cartItem.productId.toString() !== productId
          );
        }
      }

      await user.save();

      const populatedCart = await User.findById(req.user.id)
        .populate("cart.productId", "name price image")
        .exec();

      return res.json(populatedCart.cart);
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }
  } catch (err) {
    console.error("Failed to update cart:", err);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

module.exports = router;
