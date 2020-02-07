// controls the products logic
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.addProduct = (req, res) => {
    // res.sendFile(path.join(rootPath, 'views', 'add-product.html'));
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false
    });
  };
  
  exports.createProduct = (req, res) => {
    const title = req.body.title;
    const imgUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description
    const product = new Product(null, title, imgUrl, price, description);
    product.save();
    res.redirect("/");
  };
  
  exports.editProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.fetchProduct(prodId, (product)=>{
      if(!product) {
        return res.redirect('/');
      }
      const editMode = req.query.edit;
      if(editMode == 'true') {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product
        });
      }else {
        res.redirect('/');
      }
  

    });
   
   
  };
  exports.updateProduct = (req, res, next) => {
    const productId = req.body.prodId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedPrice, updatedDesc);
    // save product
    updatedProduct.save();
    res.redirect('/admin/products');

  }
  exports.getProducts = (req, res) => {
      Product.fetchAll((products)=>{
          res.render("admin/products", {prods: products, path: "/admin/admin-products", pageTitle: "Admin Products"});

      });

  }
  exports.deleteProduct= (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteProduct(productId);
   
    res.redirect('/admin/products');

  }
  