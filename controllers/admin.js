// controls the products logic
const Product = require("../models/product");
const mongoDb = require("mongodb");
// const Cart = require("../models/cart");

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
  const description = req.body.description;
  console.log(req.theuser);
  const userid = req.theuser._id;
  const product = new Product(
    title,
    price,
    description,
    imgUrl,
    null,
    userid
  );
  product
    .save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => console.log(err));

  /*
  req.user
    .createProduct({
      title: title,
      imageUrl: imgUrl,
      price: price, 
      description: description
    })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
    */
};

exports.editProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.fetchById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      const editMode = req.query.edit;
      if (editMode == "true") {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => console.log(err));
  /*
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      const editMode = req.query.edit;
      if (editMode == "true") {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => console.log(err));  
    */
};
exports.updateProduct = (req, res, next) => {
  const productId = req.body.prodId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    productId
  );

  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/admin-products",
        pageTitle: "Admin Products"
      });
    })
    .catch(err => console.log(err));
  /*
  req.user.getProducts() 
    .then(products => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/admin-products", 
        pageTitle: "Admin Products"
      });
    })
    .catch(err => {
      console.log(err);
    }); */
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
