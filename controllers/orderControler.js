const Order = require('../models/Orders');

exports.OrderHistory =  async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).lean();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
