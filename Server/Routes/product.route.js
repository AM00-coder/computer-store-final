const express = require('express');
const router = express.Router();
const Product = require('../Models/ProductSchema');

// ✅ GET: Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ✅ POST: Add a new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved); // return the saved product with _id
  } catch (err) {
    console.error("❌ Error saving product:", err);
    res.status(500).json({ message: 'Failed to save product' });
  }
});

// ✅ PUT: Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // return the updated document
        runValidators: true  // enforce schema validation
      }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

module.exports = router;
