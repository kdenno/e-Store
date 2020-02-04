const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const NotFoundController = require("./controllers/404controller");

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

// since router object imported to this file is  a valid middleware object therefore we can use .use()
app.use("/admin", adminData.routes);
app.use(shopRoutes);

// add middleware for 404
app.use(NotFoundController.NotFound);

app.listen(8000);
