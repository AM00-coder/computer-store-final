const mongoose = require('mongoose');
const { Schema } = mongoose;

const BuildItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, min: 1, default: 1 },
  priceAtAdd:{ type: Number, min: 0, default: 0 }, // snapshot price
}, { _id: false });

const BuildSchema = new Schema({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:     { type: String, default: 'My PC Build' },
  items:    { type: [BuildItemSchema], default: [] },
  totalPrice: { type: Number, min: 0, default: 0 },
  isPaid:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Build', BuildSchema);
