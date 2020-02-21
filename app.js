const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const sequelize = require("sequelize");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const NotFoundController = require("./controllers/404controller");
// const connection = require('./util/database').connect;
const User = require("./models/user");
const mongoose = require("mongoose");
/*

// import database
const database = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

*/

// execute express coz the express package returns a function
const app = express();

// declare view engine
app.set("view engine", "ejs");
// location of views
app.set("views", "views");

// by default, response from express is not parsed so use middleware and parse all responses
app.use(bodyParser.urlencoded({ extended: false }));
// allow access to static files
app.use(express.static(path.join(__dirname, "public")));

// create middleware for user
app.use((req, res, next) => {
  User.findUserById("5e4a8d9f2b5b520faf5477fd")
    .then(user => {
      req.theuser = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

// since router object imported to this file is  a valid middleware object therefore we can use .use()
app.use("/admin", adminData.routes);
app.use(shopRoutes);

// add middleware for 404
app.use(NotFoundController.NotFound);

/*
// create relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem}); // for manytomany to work they need an intemediary table that will connect them and for that you use through
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

// sync modules to tables
database
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      // create one
      return User.create({ name: "Kdenno", email: "dummyemail@gmail.com" });
    }
    return user;
  })
  .then(user => {
    // go ahead and create cart for the user
    return user.createCart();
  }).
  then(cart => {
    app.listen(8000);
  })
  .catch(err => {
    console.log("error occured");
  });
  
  */
// connnect with mongoose
mongoose
  .connect(
    "mongodb+srv://node-complete:Inventions@256@cluster0-k1a0c.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(result => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
/*
 // connnect with mongoDB
 connection(()=> {
   // start the server
   app.listen(8000);

 }); 
 */
