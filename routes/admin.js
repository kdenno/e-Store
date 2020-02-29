const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");

// /admin/add-product
router.get("/add-product", isAuth, adminController.addProduct);
router.get("/products", adminController.getProducts);
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .trim()
      .isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isNumeric(),
    body("description")
      .trim()
      .isLength({ min: 5, max: 400 })
  ],
  isAuth,
  adminController.createProduct
);
router.get("/edit-product/:productId", isAuth, adminController.editProduct);
router.post(
  "/update-product",
  [
    body("title")
      .isString()
      .trim()
      .isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isNumeric(),
    body("description")
      .trim()
      .isLength({ min: 5, max: 400 })
  ],
  isAuth,
  adminController.updateProduct
);
router.post("/delete-product", isAuth, adminController.deleteProduct);

exports.routes = router;
