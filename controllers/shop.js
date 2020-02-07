const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  // call fetchAll with a callback function that will be called and products will passed to it as an argument
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "products"
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.fetchProduct(prodId, product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "products"
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
  // get all cart products
  Cart.getCartProducts(cartproducts => {
    const allproducts = [];
    let productData;
    Product.fetchAll(products => {
      products.forEach(product => {
        productData = cartproducts.products.find(
          prod => prod.id === product.id
        );
        if(productData){
          allproducts.push({pdata: product, qty: productData.qty});

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
  Product.fetchProduct(productid, (product)=> {
    Cart.addProduct(productid, product.price);
  res.redirect("/cart");
  });
  
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "checkout", pageTitle: "Checkout" });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { path: "orders", pageTitle: "Orders" });
};
