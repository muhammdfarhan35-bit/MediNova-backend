const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  name: String,
  description: String,
  price: Number,
  discountedprice: Number,
  quantity: Number,
  imageUrl: String
});

module.exports = mongoose.model('Products', productSchema);
