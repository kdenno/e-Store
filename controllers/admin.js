// controls the products logic
const Product = require("../models/product");

exports.addProduct = (req, res) => {
    // res.sendFile(path.join(rootPath, 'views', 'add-product.html'));
    res.render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product"
    });
  };
  
  exports.createProduct = (req, res) => {
    const title = req.body.title;
    const imgUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description
    const product = new Product(title, imgUrl, price, description);
    product.save();
    res.redirect("/");
  };
  exports.getProducts = (req, res) => {
      Product.fetchAll((products)=>{
          res.render("admin/products", {prods: products, path: "/admin/admin-products", pageTitle: "Admin Products"});

      });

  }