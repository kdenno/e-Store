const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
// const sequelize = require("sequelize");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const NotFoundController = require("./controllers/404controller");
// get ajax routes
const adminAjx = require("./routes/adminAjax");
// const connection = require('./util/database').connect;
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoSessionStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
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
// init csrf protection
const csrfProtection = csrf();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// execute express coz the express package returns a function
const app = express();
const sessionStore = new MongoSessionStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
const fileStorege = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimeType === "image/png" ||
    file.mimeType === "image/jpg" ||
    file.mimeType === "image/jpeg"
  ) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
  }
};
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: a }
);
// declare view engine
app.set("view engine", "ejs");
// location of views
app.set("views", "views");

// by default, response from express is not parsed so use middleware and parse all responses
app.use(bodyParser.urlencoded({ extended: false }));
// now body parse only purses text we need multer to work on images
app.use(
  multer({ storage: fileStorege, fileFilter: fileFilter }).single("image")
); // 'image' is the field name thats containing the image data in the incoming form

// allow access to static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

// create session middleware
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  })
);

// csrf depends on sessions, need to use it after creating a session
app.use(csrfProtection);
app.use(flash());

// create user middleware based of session data if not session data i.e user has logged out, then nothing happens
app.use((req, res, next) => {
  if (!req.session.theuser) {
    return next();
  }
  User.findById(req.session.theuser._id)
    .then(user => {
      if (!user) {
        return next();
      }
      // set mongoose user object to request
      req.theuser = user;
      next();
    })
    .catch(err => {
      // throw new Error(err); throwing insinde callbacks and promises doesnt work we have to use next it only works when done outside
      next(new Error(err));
    });
});

// create middleware to send local variables to all responses
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// since router object imported to this file is  a valid middleware object therefore we can use .use()
app.use("/admin", adminData.routes);
app.use("/admin", adminAjx.routes);
app.use(shopRoutes);
app.use(authRoutes);

// add route for 500
app.get("/500", NotFoundController.ErrorOccured);

// add middleware for 404
app.use(NotFoundController.NotFound);

// create global error handler
app.use((error, req, res, next) => {
  res.redirect("/500");
});

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
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 8000);
    // const server = app.listen(process.env.PORT || 8000);
    // const io = require("socket.io")(server);
    // io.on("connection", socket => {});
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
