// controls the products logic
const Product = require("../models/product");

exports.addProduct = (req, res) => {
  // res.sendFile(path.join(rootPath, 'views', 'add-product.html'));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.createProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};
exports.getProducts = (req, res, next) => {
  // render and pass data into the view
  const products = Product.fetchAll();
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
};
