const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// /admin/add-product
router.get('/add-product', adminController.addProduct);
router.get('/products', adminController.getProducts);
router.post('/add-product', adminController.createProduct);
router.get('/edit-product/:productId', adminController.editProduct);
router.post('/update-product', adminController.updateProduct);
// router.post('/delete-product', adminController.deleteProduct);

exports.routes = router; 