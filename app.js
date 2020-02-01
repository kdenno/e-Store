

const express = require('express');
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


// execute express coz the express package returns a function
const app = express();

// by default, response from express is not parsed so use middleware and parse all responses
app.use(bodyParser.urlencoded({extended: false}));

// since router object imported to this file is  a valid middleware object therefore we can use .use()
app.use(adminRoutes);
app.use(shopRoutes);


app.listen(8000);