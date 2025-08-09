// Server/Routes/build.route.js
const express = require('express');
const mongoose = require('mongoose');
const Build = require('../Models/BuildSchema');
const Product = require('../Models/ProductSchema');

const buildsRouter = express.Router();
const isId = (id) => mongoose.Types.ObjectId.isValid(id);

/** Recalculate total with populated items */
async function recalcTotal(build) {
  await build.populate('items.productId');
  build.totalPrice = build.items.reduce((sum, it) => {
    const price = it.productId?.price ?? it.priceAtAdd ?? 0;
    return sum + price * it.quantity;
  }, 0);
}

/** MARK build as paid */
buildsRouter.put('/:id/pay', async (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return res.status(400).json({ message: 'Invalid build id' });
  try {
    const updated = await Build.findByIdAndUpdate(id, { isPaid: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Build not found' });
    res.json(updated);
  } catch (err) {
    console.error('❌ Mark build as paid failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** CREATE build */
buildsRouter.post('/', async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!isId(userId)) return res.status(400).json({ message: 'Invalid userId' });
    const build = new Build({ userId, name: name || 'My PC Build', items: [] });
    await build.save();
    res.status(201).json(build);
  } catch (e) {
    console.error('Create build failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** GET all builds for a user */
buildsRouter.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isId(userId)) return res.status(400).json({ message: 'Invalid userId' });
    const builds = await Build.find({ userId }).sort('-updatedAt');
    res.json(builds);
  } catch (e) {
    console.error('Get builds failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** GET single build */
buildsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: 'Invalid id' });
    const build = await Build.findById(id).populate('items.productId');
    if (!build) return res.status(404).json({ message: 'Build not found' });
    res.json(build);
  } catch (e) {
    console.error('Get build failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** ADD or UPDATE an item in build */
buildsRouter.put('/:id/addItem', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity = 1 } = req.body;
    if (!isId(id) || !isId(productId)) return res.status(400).json({ message: 'Invalid ids' });

    const build = await Build.findById(id);
    if (!build) return res.status(404).json({ message: 'Build not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = build.items.find(i => i.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      build.items.push({ productId, quantity, priceAtAdd: product.price });
    }

    await recalcTotal(build);
    await build.save();
    res.json(build);
  } catch (e) {
    console.error('Add item to build failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** REMOVE an item from build */
buildsRouter.put('/:id/removeItem', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    if (!isId(id) || !isId(productId)) return res.status(400).json({ message: 'Invalid ids' });

    const build = await Build.findById(id);
    if (!build) return res.status(404).json({ message: 'Build not found' });

    build.items = build.items.filter(i => i.productId.toString() !== productId);
    await recalcTotal(build);
    await build.save();
    res.json(build);
  } catch (e) {
    console.error('Remove item from build failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** UPDATE name / isPaid */
buildsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isPaid } = req.body;
    if (!isId(id)) return res.status(400).json({ message: 'Invalid id' });

    const build = await Build.findById(id);
    if (!build) return res.status(404).json({ message: 'Build not found' });

    if (typeof name === 'string') build.name = name;
    if (typeof isPaid === 'boolean') build.isPaid = isPaid;

    await recalcTotal(build);
    await build.save();
    res.json(build);
  } catch (e) {
    console.error('Update build failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/** DELETE build */
buildsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await Build.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Build not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error('Delete build failed:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = buildsRouter; // ✅ export the SAME variable
