const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// /admin/add-product
router.get('/add-product', adminController.addProduct);
router.get('/products', adminController.getProducts);
router.post('/add-product', adminController.createProduct);


exports.routes = router;