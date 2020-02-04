const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // call fetchAll with a callback function that will be called and products will passed to it as an argument
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/products"
    });
  });
};

exports.getIndex = (req, res, next) => {
  // call fetchAll with a callback function that will be called and products will passed to it as an argument
  Product.fetchAll(products => {
    res.render("shop/index", { prods: products, pageTitle: "Shop", path: "/" });
  });
};
exports.getCart = (req, res, next) => {
  res.render("shop/cart", { path: "cart", pageTitle: "Cart" });
};
exports.getCheckout = () => {
  res.render("shop/checkout", { path: "checkout", pageTitle: "Checkout" });
};
