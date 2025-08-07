const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createProduct, getAllProducts, getLimitedProducts, updateProduct, checkProductStocks, checkout, deteteProduct } = require('../controllers/productController');

router.post('/products', upload.single('image'), createProduct);
router.get('/getproducts', getAllProducts);
router.get('/getproducts/:limit', getLimitedProducts);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/delete-product/:id', deteteProduct);
router.get('/checkstock/:productId', checkProductStocks);
router.post('/checkout', checkout);

module.exports = router;
