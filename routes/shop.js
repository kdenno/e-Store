const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

 router.get('/', shopController.getIndex);
// router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
// router.post('/create-order', shopController.createOrder);
// router.post('/cart-delete-item', shopController.deleteCartItem);
// router.get('/products', shopController.getProducts);
 router.get('/products/:prodId', shopController.getProduct);
// router.get('/orders', shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);

module.exports = router;
