const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "products"
      });
    })
    .catch(err => {
      console.log("err");
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => {
      console.log(err);
    }); 
  /*
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => {
      console.log(err);
    }); 
    */
};
exports.getCart = (req, res, next) => {
  // get all cart products
  req.theuser.getCart().then(products=> {
    res.render("shop/cart", {
      path: "cart",
      products: products,
      pageTitle: "Cart"
    });
  }).catch(err => console.log(err));

  /*
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts(); // getProducts is a magic method that was created by the relationship
    })
    .then(products => {
      res.render("shop/cart", {
        path: "cart",
        products: products,
        pageTitle: "Cart"
      });
    })
    .catch(err => console.log(err)); */
};
exports.postCart = (req, res, next) => {
  const productid = req.body.prodId;
  const User = req.theuser;
  // get the product
  Product.findById(productid)
    .then(product => {
      return User.addToCart(product);
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
  /*
  let fetchedCart;
  let newquantity = 1;
  // get user's cart 
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      // check if product is available in cart
      return cart.getProducts({ where: { id: productid } });
    })
    .then(product => {
      let cartproduct;
      if (product.length > 0) {
        cartproduct = product[0];
      }

      if (cartproduct) {
        // product exists, update its quantity
        const oldquantity = cartproduct.cartItem.quantity;
        newquantity = oldquantity + 1;
      }
      // current product is not in the cart, include it and set its quantity
      return Product.findByPk(productid);
    })
    .then(product => {
      fetchedCart.addProduct(product, {
        through: { quantity: newquantity }
      }); // add product to cart and update the intermediarry table

      res.redirect("/cart");
    })
    .catch(err => console.log(err));
     */
};
exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.theuser.deleteCartItem(prodId).then(result => {
    res.redirect("/cart");

  }).catch(err => console.log(err));
  // get user's cart
  /*
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err)); 
    */
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "checkout", pageTitle: "Checkout" });
};
exports.getOrders = (req, res, next) => {
  req.theuser.getOrders().then(orders => {
    res.render("shop/orders", {
      path: "orders",
      pageTitle: "Orders",
      orders: orders
    });

  }).catch()
  
  /*
  req.user
    .getOrders({ include: ["products"] }) // get orders but include products per order
    .then(orders => {
      res.render("shop/orders", {
        path: "orders",
        pageTitle: "Orders",
        orders: orders
      });
    })
    .catch(err => console.log(err)); */
};

// orders
exports.createOrder = (req, res, next) => {
  req.theuser.createOrder().then(result => {
    res.redirect("/orders");

  }).catch(err => console.log(err))
  /*
  // get all cart items and move them to an order
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      // get all cart products
      return cart.getProducts();
    })
    .then(products => {
      // just as cart is related to a user is order so create an order for this user
      return req.user
        .createOrder()
        .then(order => {
          // connect order to products
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          ); // modify products to add quantity for each product
        })
        .catch(err => console.log());
    })
    .then(result => {
      // reset cart
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
     */
};
