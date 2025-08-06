const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // ✅ Should match model name, not collection name
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  isPaid: {
    type: Boolean,
    default: false,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
}, {
  collection: "cart",
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model("cart", CartSchema);
