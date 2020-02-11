const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products=>{
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "products"
    });
  }).catch(err => {
    console.log(err);
  });
 
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findByPk(prodId).then(product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "products"
    });
  }).catch(err => {
    console.log('err');
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render("shop/index", { prods: products, pageTitle: "Shop", path: "/" });
  }).catch(err => {
    console.log(err);
  });
};
exports.getCart = (req, res, next) => {
  // get all cart products
  Cart.getCartProducts(cartproducts => {
    const allproducts = [];
    let productData;
    Product.findAll().then(products => {
      products.forEach(product => {
        productData = cartproducts.products.find(
          prod => prod.id === product.id
        );
        if (productData) {
          allproducts.push({ pdata: product, qty: productData.qty });
        }
      });

      res.render("shop/cart", {
        path: "cart",
        products: allproducts,
        pageTitle: "Cart"
      });
    });
  });
};
exports.postCart = (req, res, next) => {
  const productid = req.body.prodId;
  // get product price
  Product.fetchProduct(productid, product => {
    Cart.addProduct(productid, product.price);
    res.redirect("/cart");
  });
};
exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  // get product
  Product.fetchProduct(prodId, product => {

    Cart.deleteCartProduct(prodId, product.price);
    res.redirect('/cart');

  });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "checkout", pageTitle: "Checkout" });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { path: "orders", pageTitle: "Orders" });
};
