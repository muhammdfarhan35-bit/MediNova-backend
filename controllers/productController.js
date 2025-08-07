const Product = require('../models/Products');
const Order = require('../models/Orders');
const { v4: uuidv4 } = require('uuid');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountedprice, quantity } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const product = new Product({
      uuid: uuidv4(),
      name,
      description,
      price,
      discountedprice,
      quantity,
      imageUrl
    });

    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getLimitedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 3;
    const products = await Product.find().limit(limit);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    if (req.file) {
      updateFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deteteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

exports.checkProductStocks = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ available: product.quantity });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkout = async (req, res) => {
  const { cartItems, user } = req.body;

  if (!user || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }

  try {
    // Step 1: Validate & update stock
    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item._id}` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.quantity -= item.quantity;
      await product.save();
    }

    // Step 2: Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.discountedprice, 0);

    const orderNumber = `ORD-${Date.now()}`;

    // Step 3: Save order
    const order = new Order({
      orderNumber,
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        discountedprice: item.discountedprice
      })),
      totalItems,
      totalAmount,
      userId: user._id,
      userEmail: user.email,
    });

    await order.save();

    return res.status(200).json({ message: 'Order placed successfully!', orderId: order._id });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};