const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");
const ITEMS_PER_PAGE = 2;
const stripe = require("stripe")("sk_test_2oikkdY7unFJu53kusbOgX0700tN4PF9Xv");

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProducts;
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page > totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProducts;
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page > totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  // now that we have cart details on the user, just use the populate method to populate with product data we use execPopulate() on populate because populate alone does not return a promise
  req.theuser
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "cart",
        products: products,
        pageTitle: "Cart"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  req.theuser
    .deleteCartItem(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  let total = 0;
  let products;
  req.theuser
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      products.forEach(product => {
        total += product.quantity * product.productId.price;
      });
      // stripe expects certain fields so we need to alter our product and return a totally different object. we multiply product price with 100 to turn it into cents
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: "usd",
            quantity: p.quantity
          };
        }),
        success_url: req.protocal + "//" + req.get("host") + "/checkout/success",
        cancel_url: req.protocal + "//" + req.get("host") + "/checkout/cancel"
      });
    })
    .then(stripeSession => {
      res.render("shop/checkout", {
        path: "checkout",
        products: products,
        pageTitle: "Checkout",
        total: total,
        sessionId: stripeSession.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.theuser._id })
    .then(orders => {
      res.render("shop/orders", {
        path: "orders",
        pageTitle: "Orders",
        orders: orders
      });
    })
    .catch();

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

exports.getCheckoutSuccess = (req, res, next) => {
  req.theuser
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { product: { ...i.productId._doc }, quantity: i.quantity }; // productId has alot of meta data so use ._doc to get exact data we want
      });
      const order = new Order({
        products: products,
        email: req.theuser.email,
        userId: req.theuser._id
      });
      return order.save();
    })
    .then(result => {
      // clear cart
      return req.theuser.clearCart();
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
// orders
exports.createOrder = (req, res, next) => {
  req.theuser
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { product: { ...i.productId._doc }, quantity: i.quantity }; // productId has alot of meta data so use ._doc to get exact data we want
      });
      const order = new Order({
        products: products,
        email: req.theuser.email,
        userId: req.theuser._id
      });
      return order.save();
    })
    .then(result => {
      // clear cart
      return req.theuser.clearCart();
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  
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
  }
  exports.getInvoice = (req, res, next) => {
    orderId = req.params.orderId;
    Order.findById()
      .then(order => {
        if (!order) {
          return next(new Error("Order not found"));
        }
        if (order.user.userId.toString() !== req.theuser._id.toString()) {
          return next(new Error("UnAuthorized"));
        }
        const InvoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("data", "invoices", InvoiceName);
        const pdfDoc = new pdfkit();
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + InvoiceName + ' "'
        ); // pdf is automatically downloaded
        // pdfDoc is a readable stream therefore pipe it into a writable stream to be written on i.e we want to store the same file on the server side
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        // write it to the client
        pdfDoc.pipe(res);
        // now here we are both going to write to the file as we are streaming to the client directly
        pdfDoc.fontSize(30).text("Invoice", {
          underline: true
        });
        pdfDoc.text("---------------------------------");
        let totalPrice = 0;
        order.products.forEach(prod => {
          totalPrice += prod.quantity * prod.product.price;
          pdfDoc
            .fontSize(14)
            .text(
              prod.product.title +
                "-" +
                prod.quantity +
                " x " +
                "$" +
                prod.product.price
            );
        });
        pdfDoc.text("---------------------------------");

        pdfDoc.text("Total Price " + totalPrice);
        // indicate end
        pdfDoc.end();
        /*
        fs.readFile(invoicePath, (err, data) => {
          if (err) {
            return next();
          }
          // set some instructions for the browser
          res.setHeader("Content-Type", "application/pdf");
          // res.setHeader('Content-Disposition', 'inline; filename="'+InvoiceName+' "'); // pdf opens in the same tab in the browser
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="' + InvoiceName + ' "'
          ); // pdf is automatically downloaded
          res.send(data);
        });
        */
        // const file = fs.createReadStream(invoicePath);

        // file.pipe(res);
      })
      .catch(err => next(err));
  };

