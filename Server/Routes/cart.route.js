const express = require("express");
const mongoose = require("mongoose");
const cartRouter = express.Router();
const Cart = require("../Models/CartSchema");

// ✅ GET CART by userId
cartRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "❌ Invalid userId format" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Failed to fetch cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ ADD product to cart
cartRouter.put("/addProduct/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid IDs" });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(p => p.productId.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ productId, quantity: quantity || 1 });
    }

    await cart.populate("products.productId");

    cart.totalPrice = cart.products.reduce((sum, item) => {
      return sum + (item.productId.price || 0) * item.quantity;
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Add to cart failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ REMOVE product from cart
cartRouter.put("/removeProduct/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid IDs" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.populate("products.productId");

    cart.totalPrice = cart.products.reduce((sum, item) => {
      return sum + (item.productId.price || 0) * item.quantity;
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Remove from cart failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ PAY endpoint (clear cart)
cartRouter.put("/pay/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    cart.totalPrice = 0;
    cart.isPaid = true;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Payment failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = cartRouter;
