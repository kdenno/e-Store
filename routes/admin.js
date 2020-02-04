const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/products');


router.get('/add-product', productControllers.addProduct);
router.post('/add-product', productControllers.createProduct);


exports.routes = router;