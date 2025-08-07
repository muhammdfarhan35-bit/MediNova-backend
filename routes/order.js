const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControler');

router.get('/orders/:userId', orderController.OrderHistory);

module.exports = router;
