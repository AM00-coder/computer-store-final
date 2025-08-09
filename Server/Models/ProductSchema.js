const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  quantity: { type: Number,required: true, min: 0,}
}, {
  versionKey: false // no __v
});

// ✅ Uses model 'Product' (for ref) and collection 'products' (real collection in DB)
module.exports = mongoose.model('Product', ProductSchema, 'products');
