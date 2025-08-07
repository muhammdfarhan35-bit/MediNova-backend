// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      discountedprice: Number,
    }
  ],
  totalAmount: Number,
  totalItems: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add User reference
  userEmail: String, // Optional for identification
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
