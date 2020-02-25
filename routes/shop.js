const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/create-order", isAuth, shopController.createOrder);
router.post("/cart-delete-item", isAuth, shopController.deleteCartItem);
router.get("/products", shopController.getProducts);
router.get("/products/:prodId", shopController.getProduct);
router.get("/orders", isAuth, shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);

module.exports = router;
