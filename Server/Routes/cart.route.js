const express = require("express");
const mongoose = require("mongoose");
const cartRouter = express.Router();
const Cart = require("../Models/CartSchema");
const Product = require('../Models/ProductSchema');


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
    // ✅ Get product to check available stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Find or create cart, and make sure it's unpaid when modified
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [], isPaid: false });   // set false on create
    }

    const existingProduct = cart.products.find(p => p.productId.toString() === productId);
    const requestedQuantity = Number(quantity) || 1;
    const currentCartQty = existingProduct ? existingProduct.quantity : 0;
    const totalAfterAdd = currentCartQty + requestedQuantity;

    // ✅ Block if requested exceeds available stock
    if (totalAfterAdd > product.quantity) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${product.quantity}, Already in cart: ${currentCartQty}`
      });
    }

    // ✅ Add or update product in cart
    if (existingProduct) {
      existingProduct.quantity += requestedQuantity;
    } else {
      cart.products.push({ productId, quantity: requestedQuantity });
    }

    // ✅ Any cart change = unpaid until checkout completes
    cart.isPaid = false;

    // ✅ Recalculate total price
    await cart.populate("products.productId");
    cart.totalPrice = cart.products.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Add to cart failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
cartRouter.put('/:userId/clear', async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = [];
    cart.totalPrice = 0;
    // keep isPaid = true if you want to indicate last order was paid
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('❌ Clear cart failed:', err);
    res.status(500).json({ message: 'Internal server error' });
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
    const cart = await Cart.findOne({ userId, isPaid: false });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found or already paid" });
    }

    cart.isPaid = true;
    await cart.save();
    res.status(200).json({ message: "Cart marked as paid" });
  } catch (err) {
    console.error("❌ Payment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
cartRouter.put('/:userId/pay', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    // Find the open cart (unpaid) for this user
    const cart = await Cart.findOne({ userId, isPaid: false }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Open cart not found for this user' });
    }

    // OPTIONAL: decrement stock
    for (const item of cart.products) {
      const product = await Product.findById(item.productId._id);
      if (!product) continue;

      // Make sure we never go negative
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}`
        });
      }
      product.quantity -= item.quantity;
      await product.save();
    }

    cart.isPaid = true;
    cart.paidAt = new Date();
    await cart.save();

    res.status(200).json({ message: 'Cart paid successfully', cart });
  } catch (err) {
    console.error('❌ Mark cart as paid failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// PUT /cart/pay/:userId
cartRouter.put('/pay/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.isPaid = true;
    cart.products = [];      // ⬅️ clear items
    cart.totalPrice = 0;     // ⬅️ reset price
    await cart.save();

    res.status(200).json(cart);
  } catch (e) {
    console.error('Mark paid failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = cartRouter;
