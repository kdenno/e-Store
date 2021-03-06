// controls the products logic
const Product = require("../models/product");
const mongoDb = require("mongodb");
const { validationResult } = require("express-validator/check");
const fileHelper = require("../util/file");
// const Cart = require("../models/cart");

exports.addProduct = (req, res) => {
  // res.sendFile(path.join(rootPath, 'views', 'add-product.html'));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.createProduct = (req, res) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      errorMessage: "Attached file is not an image",
      product: {
        title: title,
        price: price,
        description: description
      },
      validationErrors: []
    });
  }
  // const userid = req.theuser._id;
  // const product = new Product(title,price,description,imgUrl,null,userid);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array[0].msg,
      product: {
        title: title,
        imageUrl: imgUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array()
    });
  }
  // construct image path
  const imgUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imgUrl,
    userId: req.theuser._id
  });
  // now we'll use the save method but this time its not defined in the product model but its the mongoose save();
  product
    .save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      // bubble up error to express. calling next('argument') with an argument will always trigger the global error handler
      return next(error);
    });

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
  Product.findById(prodId)
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
          hasError: false,
          errorMessage: null,
          product: product,
          validationErrors: []
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  const image = req.image;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array[0].msg,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: productId
      },
      validationErrors: errors.array()
    });
  }
  // const product = new Product(
  //   updatedTitle,
  //   updatedPrice,
  //   updatedDesc,
  //   updatedImageUrl,
  //   productId
  // );
  const product = Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.theuser._id.toString()) {
        return res.redirect("/login");
      }
      // got back a full mongoose object, go ahead and update the fields
      product.title = updatedTitle;
      if (image) {
        // delete old image
        fileHelper.deleteFile(product.imageUrl);
        // update with new image
        product.imageUrl = image.path;
      }
      product.price = updatedPrice;
      product.description = updatedDesc;
      // save product
      return product.save().then(result => {
        res.redirect("/admin/products");
      });
    })

    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getProducts = (req, res) => {
  // get products for that logged in user
  Product.find({ userId: req.theuser._id })
    //.select('title price -_id')-dictate on what fields should be returned
    //.populate('userId')-tell mongo to return the full user object details not just the id
    .then(products => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/admin-products",
        pageTitle: "Admin Products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  /*
  // using mongoDB
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/admin-products",
        pageTitle: "Admin Products"
      });
    })
    .catch(err => console.log(err));
    */
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
  return Product.findById()
    .then(prod => {
      if (!prod) {
        return next(new Error("Product doesnt exist"));
      }
      // delete product image
      fileHelper.deleteFile(prod.imageUrl);
      return Product.deleteOne({
        _id: productId,
        userId: req.theuser._id
      }).then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  /*
  Product.deleteById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err)); 
    */
};
