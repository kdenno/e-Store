

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


// execute express coz the express package returns a function
const app = express();

// by default, response from express is not parsed so use middleware and parse all responses
app.use(bodyParser.urlencoded({extended: false}));
// allow access to static files 
app.use(express.static(path.join(__dirname, 'public')));

// since router object imported to this file is  a valid middleware object therefore we can use .use()
app.use('/admin', adminRoutes);
app.use(shopRoutes);


// add middleware for 404
app.use((req, res, next) =>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(8000);