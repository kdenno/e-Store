const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// /admin/add-product
router.get("/add-product", isAuth, adminController.addProduct);
router.get("/products", adminController.getProducts);
router.post("/add-product", isAuth, adminController.createProduct);
router.get("/edit-product/:productId", isAuth, adminController.editProduct);
router.post("/update-product", isAuth, adminController.updateProduct);
router.post("/delete-product", isAuth, adminController.deleteProduct);

exports.routes = router;
