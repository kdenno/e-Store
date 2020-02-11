const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("sequelize");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const NotFoundController = require("./controllers/404controller");
// import database
const database = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

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
    User.findByPk(1)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

// since router object imported to this file is  a valid middleware object therefore we can use .use()
app.use("/admin", adminData.routes);
app.use(shopRoutes);

// add middleware for 404
app.use(NotFoundController.NotFound);



// create relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

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
    app.listen(8000);
  })
  .catch(err => {
    console.log("error occured");
  });
